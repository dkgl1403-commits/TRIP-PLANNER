import os
import uuid
from sqlalchemy import create_engine, Column, String, Float, DateTime, JSON, Date, Integer, Boolean, Text, ForeignKey, Time, Numeric, func
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from dotenv import load_dotenv

load_dotenv('../.env')

# We can reuse the postgresql instance from FINANCE_DATABASE_URL or use a dedicated one.
DATABASE_URL = os.environ.get('FINANCE_DATABASE_URL', 'sqlite:///./hr_local.db')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_uuid():
    return str(uuid.uuid4())

class Employee(Base):
    __tablename__ = "hr_employees"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    name = Column(String, index=True)
    role = Column(String)
    department = Column(String)
    join_date = Column(Date)
    age = Column(Integer, nullable=True)
    commute_distance_miles = Column(Float, nullable=True)
    total_experience_years = Column(Integer)
    base_salary = Column(Numeric(12, 2))
    manager_id = Column(String(36), ForeignKey('hr_employees.id'), nullable=True)
    status = Column(String, default="Active") # Active, Resigned, Terminated
    ai_strengths = Column(JSON, nullable=True) # Array of strings
    ai_weaknesses = Column(JSON, nullable=True) # Array of strings

    manager = relationship("Employee", remote_side=[id])

class EmployeeDailyLog(Base):
    __tablename__ = "hr_employee_daily_logs"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    employee_id = Column(String(36), ForeignKey('hr_employees.id'))
    date = Column(Date, index=True)
    in_time = Column(Time, nullable=True)
    out_time = Column(Time, nullable=True)
    is_leave = Column(Boolean, default=False)
    leave_type = Column(String, nullable=True) # PTO, Sick, Unpaid
    productivity_score = Column(Integer, nullable=True) # 0-100
    
    employee = relationship("Employee")

class EmployeePerformanceReview(Base):
    __tablename__ = "hr_employee_performance_reviews"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    employee_id = Column(String(36), ForeignKey('hr_employees.id'))
    review_date = Column(Date, index=True)
    review_text = Column(Text)
    
    employee = relationship("Employee")

class EmployeeAiInsight(Base):
    __tablename__ = "hr_employee_ai_insights"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    employee_id = Column(String(36), ForeignKey('hr_employees.id'))
    calculation_date = Column(Date, index=True)
    
    # ML Scores
    flight_risk_score = Column(Float) # 0.0 - 1.0
    burnout_risk_score = Column(Float) # 0.0 - 1.0
    compensation_fairness_score = Column(Float) # 0.0 - 1.0
    
    # Explainable AI
    top_risk_factors = Column(JSON) # Array of strings
    
    # GenAI Coaching
    manager_action_plan = Column(Text)
    
    employee = relationship("Employee")

class MlFeedbackLog(Base):
    __tablename__ = "hr_ml_feedback_logs"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    insight_id = Column(String(36), ForeignKey('hr_employee_ai_insights.id'))
    employee_id = Column(String(36), ForeignKey('hr_employees.id'))
    predicted_flight_risk = Column(Float)
    manager_corrected_flight_risk = Column(Float, nullable=True)
    thumbs_up = Column(Boolean) # For flight risk
    burnout_thumbs_up = Column(Boolean, nullable=True)
    comp_thumbs_up = Column(Boolean, nullable=True)
    actual_outcome = Column(String, nullable=True) # Resigned, Retained, Promoted, etc
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    insight = relationship("EmployeeAiInsight")
    employee = relationship("Employee")

def init_db():
    Base.metadata.create_all(bind=engine)
    from sqlalchemy import text
    try:
        with engine.begin() as conn:
            conn.execute(text('ALTER TABLE hr_ml_feedback_logs ADD COLUMN burnout_thumbs_up BOOLEAN'))
            conn.execute(text('ALTER TABLE hr_ml_feedback_logs ADD COLUMN comp_thumbs_up BOOLEAN'))
    except Exception:
        pass
        
    try:
        with engine.begin() as conn:
            conn.execute(text('ALTER TABLE hr_employees ADD COLUMN age INTEGER'))
            conn.execute(text('ALTER TABLE hr_employees ADD COLUMN commute_distance_miles FLOAT'))
    except Exception:
        pass
