import os
import random
import datetime
import uuid
from faker import Faker
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv('../.env')
from hr_analytics.db import Base, Employee, EmployeeDailyLog, EmployeePerformanceReview, EmployeeAiInsight

fake = Faker()

DATABASE_URL = os.environ.get('FINANCE_DATABASE_URL', 'sqlite:///./hr_local.db')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance"]
ROLES = {
    "Engineering": ["Software Engineer", "Senior Engineer", "DevOps", "QA"],
    "Sales": ["Account Executive", "Sales Development Rep", "Sales Manager"],
    "Marketing": ["Content Strategist", "SEO Specialist", "Marketing Manager"],
    "HR": ["Recruiter", "HR Business Partner"],
    "Finance": ["Financial Analyst", "Accountant"]
}

STRENGTHS = ["Strategic Planning", "Client De-escalation", "Technical Documentation", "Mentoring", "Agile Methodologies", "Public Speaking", "Data Analysis", "Cross-functional Collaboration"]
WEAKNESSES = ["Time Management", "Delegation", "Public Speaking", "Technical Documentation", "Patience", "Over-committing", "Context Switching"]

def seed_data():
    from hr_analytics.db import init_db
    init_db()
    session = SessionLocal()
    
    # Clear existing data to allow re-seeding
    print("Clearing existing data...")
    session.query(EmployeePerformanceReview).delete()
    session.query(EmployeeDailyLog).delete()
    session.query(EmployeeAiInsight).delete()
    try:
        from hr_analytics.db import MlFeedbackLog
        session.query(MlFeedbackLog).delete()
    except Exception:
        pass
    session.query(Employee).delete()
    session.commit()
    
    print("Generating 100 dummy employees...")
    employees = []
    
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=365)
    
    # 1. Generate Employees
    for _ in range(100):
        dept = random.choice(DEPARTMENTS)
        role = random.choice(ROLES[dept])
        join_date = fake.date_between(start_date='-5y', end_date='-1y')
        
        # Determine base salary roughly by role
        base_salary = random.randint(60000, 150000)
        if "Senior" in role or "Manager" in role:
            base_salary += 40000
            
        ai_strengths = random.sample(STRENGTHS, k=random.randint(1, 3))
        ai_weaknesses = random.sample(WEAKNESSES, k=random.randint(1, 2))
        
        emp = Employee(
            id=str(uuid.uuid4()),
            name=fake.name(),
            role=role,
            department=dept,
            join_date=join_date,
            age=random.randint(22, 65),
            commute_distance_miles=round(random.uniform(2.0, 60.0), 1),
            total_experience_years=random.randint(1, 15),
            base_salary=base_salary,
            status="Active",
            ai_strengths=ai_strengths,
            ai_weaknesses=ai_weaknesses
        )
        emp._leave_persona = random.choice(["normal", "sick_prone", "workaholic"]) # Temp attribute for seeding
        employees.append(emp)
        session.add(emp)
        
    session.commit()
    print("Employees created.")
    
    print("Generating 1 year of daily logs (365 days x 100 employees = 36,500 logs)...")
    # 2. Generate Daily Logs
    # To optimize insertion, we'll use bulk save
    daily_logs = []
    
    # We loop through all dates
    current_date = start_date
    while current_date <= end_date:
        is_weekend = current_date.weekday() >= 5
        
        for emp in employees:
            # Chance of taking leave (non-weekend)
            is_leave = False
            leave_type = None
            if is_weekend:
                is_leave = True
                leave_type = "Weekend"
            else:
                persona = getattr(emp, '_leave_persona', 'normal')
                leave_chance = 0.05
                leave_choices = ["PTO", "Sick", "Unpaid"]
                
                if persona == "sick_prone":
                    leave_chance = 0.15
                    leave_choices = ["Sick", "Sick", "Unpaid"] # Bias heavily to sick
                elif persona == "workaholic":
                    leave_chance = 0.01
                    
                if random.random() < leave_chance:
                    is_leave = True
                    leave_type = random.choice(leave_choices)
                
            in_time = None
            out_time = None
            productivity_score = None
            
            if not is_leave:
                # Random in_time between 8:00 and 10:00
                in_hour = random.randint(8, 9)
                in_minute = random.randint(0, 59)
                in_time = datetime.time(in_hour, in_minute)
                
                # Out time between 16:00 and 19:00 (some late workers)
                out_hour = random.randint(16, 18)
                if random.random() < 0.1: # 10% chance of staying very late (Burnout indicator)
                    out_hour = random.randint(19, 21)
                out_minute = random.randint(0, 59)
                out_time = datetime.time(out_hour, out_minute)
                
                productivity_score = random.randint(50, 100)
            
            log = EmployeeDailyLog(
                id=str(uuid.uuid4()),
                employee_id=emp.id,
                date=current_date,
                in_time=in_time,
                out_time=out_time,
                is_leave=is_leave,
                leave_type=leave_type,
                productivity_score=productivity_score
            )
            daily_logs.append(log)
            
        current_date += datetime.timedelta(days=1)
        
    # Bulk insert daily logs in chunks of 5000
    print("Bulk inserting daily logs...")
    chunk_size = 5000
    for i in range(0, len(daily_logs), chunk_size):
        session.bulk_save_objects(daily_logs[i:i+chunk_size])
        session.commit()
    
    print("Generating performance reviews...")
    # 3. Generate Performance Reviews
    # 2 reviews per employee per year
    reviews = []
    for emp in employees:
        for _ in range(2):
            review_date = fake.date_between(start_date=start_date, end_date=end_date)
            review_text = fake.paragraph(nb_sentences=5)
            # Add some contextual text based on strengths
            if emp.ai_strengths:
                review_text += f" They consistently demonstrate {emp.ai_strengths[0].lower()}."
            
            review = EmployeePerformanceReview(
                id=str(uuid.uuid4()),
                employee_id=emp.id,
                review_date=review_date,
                review_text=review_text
            )
            reviews.append(review)
            
    session.bulk_save_objects(reviews)
    session.commit()
    
    print("Seed complete! 100 employees, 36500 daily logs, 200 performance reviews generated.")
    session.close()

if __name__ == "__main__":
    seed_data()
