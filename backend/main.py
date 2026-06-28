import os
import random
import oracledb
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

app = FastAPI(title="Event Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    try:
        wallet_password = os.getenv("DB_PASSWORD")
        if not wallet_password:
            raise Exception("DB_PASSWORD not set in .env")

        dsn = "dkgloracledb1_high"
        wallet_dir = r"C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1"
        
        connection = oracledb.connect(
            user="ADMIN",
            password=wallet_password,
            dsn=dsn,
            config_dir=wallet_dir,
            wallet_location=wallet_dir,
            wallet_password=wallet_password
        )
        return connection
    except Exception as e:
        print("Database connection error:", str(e))
        raise HTTPException(status_code=500, detail="Database connection failed")

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: str
    gender: str = ""
    phone: str = ""
    address: str = ""

class LoginRequest(BaseModel):
    login_id: str
    password: str

def generate_login_id(name: str) -> str:
    parts = name.strip().split()
    if len(parts) >= 2:
        initials = (parts[0][0] + parts[-1][0]).upper()
    elif len(name) >= 2:
        initials = name[:2].upper()
    else:
        initials = (name + "X").upper()
    digits = str(random.randint(10000, 99999))
    return initials + digits

@app.post("/api/auth/signup")
def signup(request: SignupRequest):
    if request.password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Check if email exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = :1", [request.email])
        count = cursor.fetchone()[0]
        if count > 0:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        # Check if phone exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE phone = :1", [request.phone])
        count_phone = cursor.fetchone()[0]
        if count_phone > 0:
            raise HTTPException(status_code=400, detail="Phone number already registered")
            
        login_id = generate_login_id(request.name)
        
        insert_sql = """
        INSERT INTO users (login_id, password_hash, role, name, gender, phone, email, address)
        VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
        """
        user_data = (
            login_id,
            request.password, # Hash in production
            "USER",
            request.name,
            request.gender,
            request.phone,
            request.email,
            request.address
        )
        cursor.execute(insert_sql, user_data)
        conn.commit()
        
        return {"status": "success", "message": f"Account created! Your Login ID is {login_id}"}
    finally:
        conn.close()

@app.post("/api/auth/login")
def login(request: LoginRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name, password_hash FROM users WHERE login_id = :1 OR phone = :2", [request.login_id, request.login_id])
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=401, detail="Invalid Login ID or password")
            
        if row[1] != request.password:
            raise HTTPException(status_code=401, detail="Invalid Login ID or password")
            
        return {"status": "success", "message": f"Welcome back, {row[0]}!"}
    finally:
        conn.close()
