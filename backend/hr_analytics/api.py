from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time
from sqlalchemy.orm import Session
import csv
import io
import datetime

from hr_analytics.db import SessionLocal, Employee, EmployeeDailyLog

router = APIRouter(prefix="/api/employee-dashboard", tags=["hr_analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class DailyLogCreate(BaseModel):
    employee_id: str
    date: date
    in_time: Optional[time] = None
    out_time: Optional[time] = None
    is_leave: bool = False
    leave_type: Optional[str] = None
    productivity_score: Optional[int] = None

class DailyLogUpdate(BaseModel):
    in_time: Optional[time] = None
    out_time: Optional[time] = None
    is_leave: bool = False
    leave_type: Optional[str] = None
    productivity_score: Optional[int] = None

@router.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return [{"id": e.id, "name": e.name, "role": e.role, "department": e.department} for e in employees]

@router.get("/logs")
def get_logs(limit: int = 100, db: Session = Depends(get_db)):
    # In a real app we'd paginate and filter
    logs = db.query(EmployeeDailyLog).order_by(EmployeeDailyLog.date.desc()).limit(limit).all()
    result = []
    for log in logs:
        emp = db.query(Employee).filter(Employee.id == log.employee_id).first()
        result.append({
            "id": log.id,
            "employee_id": log.employee_id,
            "employee_name": emp.name if emp else "Unknown",
            "date": log.date,
            "in_time": log.in_time.strftime("%H:%M") if log.in_time else None,
            "out_time": log.out_time.strftime("%H:%M") if log.out_time else None,
            "is_leave": log.is_leave,
            "leave_type": log.leave_type,
            "productivity_score": log.productivity_score
        })
    return result

@router.post("/logs")
def create_log(log: DailyLogCreate, db: Session = Depends(get_db)):
    from hr_analytics.db import get_uuid
    db_log = EmployeeDailyLog(
        id=get_uuid(),
        employee_id=log.employee_id,
        date=log.date,
        in_time=log.in_time,
        out_time=log.out_time,
        is_leave=log.is_leave,
        leave_type=log.leave_type,
        productivity_score=log.productivity_score
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return {"message": "Log created successfully", "id": db_log.id}

@router.put("/logs/{log_id}")
def update_log(log_id: str, log_data: DailyLogUpdate, db: Session = Depends(get_db)):
    db_log = db.query(EmployeeDailyLog).filter(EmployeeDailyLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")
        
    db_log.in_time = log_data.in_time
    db_log.out_time = log_data.out_time
    db_log.is_leave = log_data.is_leave
    db_log.leave_type = log_data.leave_type
    db_log.productivity_score = log_data.productivity_score
    
    db.commit()
    return {"message": "Log updated successfully"}

@router.post("/logs/bulk")
async def upload_bulk_logs(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    contents = await file.read()
    decoded = contents.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    from hr_analytics.db import get_uuid
    logs = []
    
    for row in reader:
        try:
            # Expected CSV columns: employee_id, date, in_time, out_time, is_leave, leave_type, productivity_score
            in_t = datetime.datetime.strptime(row['in_time'], '%H:%M').time() if row.get('in_time') else None
            out_t = datetime.datetime.strptime(row['out_time'], '%H:%M').time() if row.get('out_time') else None
            
            log = EmployeeDailyLog(
                id=get_uuid(),
                employee_id=row['employee_id'],
                date=datetime.datetime.strptime(row['date'], '%Y-%m-%d').date(),
                in_time=in_t,
                out_time=out_t,
                is_leave=row.get('is_leave', '').lower() == 'true',
                leave_type=row.get('leave_type') or None,
                productivity_score=int(row['productivity_score']) if row.get('productivity_score') else None
            )
            logs.append(log)
        except Exception as e:
            # Skip invalid rows or handle them
            continue
            
    if logs:
        db.bulk_save_objects(logs)
        db.commit()
        
    return {"message": f"Successfully imported {len(logs)} logs"}

@router.post("/ml/run")
def run_ml_engine(db: Session = Depends(get_db)):
    from hr_analytics.ml_engine import calculate_insights_for_all
    try:
        result = calculate_insights_for_all(db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights")
def get_insights(db: Session = Depends(get_db)):
    from hr_analytics.db import EmployeeAiInsight
    # Fetch the latest insight for each employee
    insights = db.query(EmployeeAiInsight).order_by(EmployeeAiInsight.calculation_date.desc()).all()
    
    # We only want the most recent per employee
    latest_insights = {}
    for insight in insights:
        if insight.employee_id not in latest_insights:
            emp = db.query(Employee).filter(Employee.id == insight.employee_id).first()
            latest_insights[insight.employee_id] = {
                "id": insight.id,
                "employee_id": insight.employee_id,
                "employee_name": emp.name if emp else "Unknown",
                "role": emp.role if emp else "Unknown",
                "department": emp.department if emp else "Unknown",
                "calculation_date": insight.calculation_date,
                "flight_risk_score": insight.flight_risk_score,
                "burnout_risk_score": insight.burnout_risk_score,
                "compensation_fairness_score": insight.compensation_fairness_score,
                "top_risk_factors": insight.top_risk_factors,
                "manager_action_plan": insight.manager_action_plan
            }
            
    return list(latest_insights.values())

class MLFeedbackCreate(BaseModel):
    insight_id: str
    employee_id: str
    predicted_flight_risk: float
    manager_corrected_flight_risk: Optional[float] = None
    thumbs_up: bool
    actual_outcome: Optional[str] = None
    feedback_notes: Optional[str] = None

@router.post("/ml/feedback")
def submit_ml_feedback(feedback: MLFeedbackCreate, db: Session = Depends(get_db)):
    from hr_analytics.db import MlFeedbackLog, get_uuid
    log = MlFeedbackLog(
        id=get_uuid(),
        insight_id=feedback.insight_id,
        employee_id=feedback.employee_id,
        predicted_flight_risk=feedback.predicted_flight_risk,
        manager_corrected_flight_risk=feedback.manager_corrected_flight_risk,
        thumbs_up=feedback.thumbs_up,
        actual_outcome=feedback.actual_outcome,
        feedback_notes=feedback.feedback_notes
    )
    db.add(log)
    db.commit()
    return {"message": "Feedback submitted successfully"}

@router.post("/ml/action-plan/{insight_id}")
def generate_plan(insight_id: str, db: Session = Depends(get_db)):
    from hr_analytics.db import EmployeeAiInsight
    from hr_analytics.genai_service import generate_action_plan
    
    insight = db.query(EmployeeAiInsight).filter(EmployeeAiInsight.id == insight_id).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
        
    emp = db.query(Employee).filter(Employee.id == insight.employee_id).first()
    
    plan = generate_action_plan(emp, insight)
    
    if not plan.startswith("Error"):
        insight.manager_action_plan = plan
        db.commit()
        
    return {"plan": plan}
