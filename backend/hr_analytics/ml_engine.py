import datetime
from sqlalchemy.orm import Session
from hr_analytics.db import Employee, EmployeeDailyLog, EmployeeAiInsight, get_uuid
from sqlalchemy import func

def calculate_insights_for_all(db: Session):
    employees = db.query(Employee).all()
    results = []
    
    # Calculate company averages for compensation fairness
    role_averages = {}
    for emp in employees:
        if emp.role not in role_averages:
            role_averages[emp.role] = []
        if emp.base_salary:
            role_averages[emp.role].append(float(emp.base_salary))
            
    for role, salaries in role_averages.items():
        role_averages[role] = sum(salaries) / len(salaries) if salaries else 0

    for emp in employees:
        insight = generate_employee_insights(db, emp, role_averages)
        if insight:
            results.append(insight)
            
    return {"message": f"Generated insights for {len(results)} employees"}

def generate_employee_insights(db: Session, employee: Employee, role_averages: dict):
    # Fetch last 90 days of logs
    ninety_days_ago = datetime.date.today() - datetime.timedelta(days=90)
    
    logs = db.query(EmployeeDailyLog).filter(
        EmployeeDailyLog.employee_id == employee.id,
        EmployeeDailyLog.date >= ninety_days_ago
    ).order_by(EmployeeDailyLog.date).all()
    
    if not logs:
        return None
        
    total_days = len(logs)
    leave_days = sum(1 for log in logs if log.is_leave and log.leave_type != "Weekend")
    
    total_hours = 0
    work_days = 0
    total_productivity = 0
    
    # Recent 14 days trend
    recent_14_days_ago = datetime.date.today() - datetime.timedelta(days=14)
    recent_prod = []
    past_prod = []
    
    for log in logs:
        if not log.is_leave and log.in_time and log.out_time:
            # Calculate hours worked (rough approximation without date crossing)
            in_dt = datetime.datetime.combine(datetime.date.today(), log.in_time)
            out_dt = datetime.datetime.combine(datetime.date.today(), log.out_time)
            hours = (out_dt - in_dt).seconds / 3600
            total_hours += hours
            work_days += 1
            
            if log.productivity_score:
                total_productivity += log.productivity_score
                if log.date >= recent_14_days_ago:
                    recent_prod.append(log.productivity_score)
                else:
                    past_prod.append(log.productivity_score)
                    
    avg_hours_per_day = (total_hours / work_days) if work_days > 0 else 0
    avg_prod_recent = (sum(recent_prod) / len(recent_prod)) if recent_prod else 0
    avg_prod_past = (sum(past_prod) / len(past_prod)) if past_prod else 0
    
    # 1. Burnout Risk (0.0 to 1.0)
    # High hours (>9/day), low leave, dropping productivity
    burnout_score = 0.2 # Base
    if avg_hours_per_day > 9.5:
        burnout_score += 0.3
    elif avg_hours_per_day > 8.5:
        burnout_score += 0.1
        
    if (leave_days / total_days) < 0.05: # Less than 5% leave in 90 days
        burnout_score += 0.2
        
    if avg_prod_recent < avg_prod_past and avg_prod_past > 0:
        burnout_score += 0.2
        
    burnout_score = min(1.0, burnout_score)
    
    # 2. Compensation Fairness
    # Compare with role average
    role_avg = role_averages.get(employee.role, 0)
    comp_score = 0.5
    if role_avg > 0 and employee.base_salary:
        ratio = float(employee.base_salary) / role_avg
        if ratio > 1.1:
            comp_score = 0.9 # Highly fair/overpaid
        elif ratio < 0.8:
            comp_score = 0.1 # Very unfair
        elif ratio < 0.9:
            comp_score = 0.3 # Unfair
        else:
            comp_score = 0.7 # Fair
            
    # 3. Flight Risk
    # High burnout, low comp, long tenure
    flight_score = 0.1
    if burnout_score > 0.7:
        flight_score += 0.3
    if comp_score < 0.4:
        flight_score += 0.3
    if employee.total_experience_years and employee.total_experience_years > 3:
        flight_score += 0.1
    if avg_prod_recent < (avg_prod_past * 0.8): # Significant drop in productivity
        flight_score += 0.2
        
    flight_score = min(1.0, flight_score)
    
    # Explainable AI Factors
    risk_factors = []
    if burnout_score > 0.7:
        risk_factors.append("Consistently high working hours leading to potential burnout")
    if comp_score < 0.4:
        risk_factors.append("Compensation is significantly below peer average for this role")
    if avg_prod_recent < (avg_prod_past * 0.9):
        risk_factors.append("Noticeable decline in daily productivity over the last 14 days")
    if (leave_days / total_days) < 0.02:
        risk_factors.append("Employee has taken almost no time off recently")

    if not risk_factors:
        risk_factors.append("Employee is stable with no immediate risk factors detected.")
        
    # Check if insight already exists for today
    existing = db.query(EmployeeAiInsight).filter(
        EmployeeAiInsight.employee_id == employee.id,
        EmployeeAiInsight.calculation_date == datetime.date.today()
    ).first()
    
    if existing:
        existing.flight_risk_score = flight_score
        existing.burnout_risk_score = burnout_score
        existing.compensation_fairness_score = comp_score
        existing.top_risk_factors = risk_factors
        db.commit()
        return existing
    else:
        new_insight = EmployeeAiInsight(
            id=get_uuid(),
            employee_id=employee.id,
            calculation_date=datetime.date.today(),
            flight_risk_score=flight_score,
            burnout_risk_score=burnout_score,
            compensation_fairness_score=comp_score,
            top_risk_factors=risk_factors,
            manager_action_plan="" # Generated later via GenAI
        )
        db.add(new_insight)
        db.commit()
        return new_insight
