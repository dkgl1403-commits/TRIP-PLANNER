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
