import os
import random
import uuid
import boto3
from botocore.client import Config
import oracledb
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env", override=True)
load_dotenv(dotenv_path="../.env", override=False)

app = FastAPI(title="Event Planner API")

@app.on_event("startup")
def startup_event():
    try:
        from finance_pipeline.db import init_db
        init_db()
        
        from finance_pipeline.scheduler import start_scheduler
        start_scheduler()
    except Exception as e:
        print(f"Failed to start finance scheduler: {e}")

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
        
        remote_wallet = "/home/ubuntu/wallet"
        local_wallet = r"C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1"
        
        wallet_dir = remote_wallet if os.path.exists(remote_wallet) else local_wallet
        
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
        cursor.execute("SELECT login_id, name, password_hash, phone, role FROM users WHERE login_id = :1 OR phone = :2", [request.login_id, request.login_id])
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=401, detail="Invalid Login ID or password")
            
        if row[2] != request.password:
            raise HTTPException(status_code=401, detail="Invalid Login ID or password")
            
        return {
            "status": "success", 
            "message": f"Welcome back, {row[1]}!",
            "name": row[1],
            "login_id": row[0],
            "phone": row[3],
            "role": row[4]
        }
    finally:
        conn.close()

from fastapi import BackgroundTasks

@app.post("/api/admin/trigger-news-fetch")
def trigger_news_fetch(background_tasks: BackgroundTasks):
    try:
        from finance_pipeline.scheduler import fetch_financial_news
        background_tasks.add_task(fetch_financial_news)
        return {"status": "success", "message": "News fetcher triggered in background"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from typing import List, Optional
import boto3
from botocore.config import Config

class Checkpoint(BaseModel):
    name: str
    lat: float
    lon: float
    order_idx: int

class Participant(BaseModel):
    name: str
    mobile: Optional[str] = None
    email: Optional[str] = None

class TripCreateRequest(BaseModel):
    login_id: str
    title: str
    source_name: str
    source_lat: float
    source_lon: float
    dest_name: str
    dest_lat: float
    dest_lon: float
    start_date: str
    end_date: str
    cover_image_url: Optional[str] = None
    description: Optional[str] = None
    checkpoints: List[Checkpoint] = []
    participants: List[Participant] = []

@app.post("/api/trips")
def create_trip(request: TripCreateRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Insert Trip
        insert_trip_sql = """
            INSERT INTO trips (
                login_id, title, source_name, source_lat, source_lon,
                dest_name, dest_lat, dest_lon, start_date, end_date, cover_image_url, description
            ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12)
            RETURNING id INTO :13
        """
        out_val = cursor.var(int)
        cursor.execute(insert_trip_sql, [
            request.login_id, request.title, request.source_name, request.source_lat, request.source_lon,
            request.dest_name, request.dest_lat, request.dest_lon, request.start_date, request.end_date, 
            request.cover_image_url, request.description, out_val
        ])
        
        trip_id = out_val.getvalue()[0]
        
        # Insert Checkpoints
        if request.checkpoints:
            chk_data = [(trip_id, c.name, c.lat, c.lon, c.order_idx) for c in request.checkpoints]
            cursor.executemany(
                "INSERT INTO trip_checkpoints (trip_id, name, lat, lon, order_idx) VALUES (:1, :2, :3, :4, :5)",
                chk_data
            )
            
        # Insert Participants
        if request.participants:
            part_data = [(trip_id, p.name, p.mobile, p.email) for p in request.participants]
            cursor.executemany(
                "INSERT INTO trip_participants (trip_id, name, mobile, email) VALUES (:1, :2, :3, :4)",
                part_data
            )
            
        conn.commit()
        return {"status": "success", "message": "Trip created successfully!", "trip_id": trip_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/trips/{trip_id}/participants")
def add_trip_participant(trip_id: int, p: Participant):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO trip_participants (trip_id, name, mobile, email) VALUES (:1, :2, :3, :4)",
            [trip_id, p.name, p.mobile, p.email]
        )
        conn.commit()
        return {"status": "success", "message": "Participant added"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


class ParticipantEditRequest(BaseModel):
    original_name: str
    name: str
    mobile: Optional[str] = None
    email: Optional[str] = None

@app.put("/api/trips/{trip_id}/participants")
def update_trip_participant(trip_id: int, req: ParticipantEditRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE trip_participants SET name = :1, mobile = :2, email = :3 WHERE trip_id = :4 AND name = :5",
            [req.name, req.mobile, req.email, trip_id, req.original_name]
        )
        conn.commit()
        return {"status": "success", "message": "Participant updated"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@app.delete("/api/trips/{trip_id}/participants/{participant_name}")
def remove_trip_participant(trip_id: int, participant_name: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM trip_participants WHERE trip_id = :1 AND name = :2",
            [trip_id, participant_name]
        )
        conn.commit()
        return {"status": "success", "message": "Participant removed"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/upload/presign")
def get_presigned_url(filename: str):
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    namespace = os.getenv('NAMESPACE')
    endpoint_url = f"https://{namespace}.compat.objectstorage.ap-mumbai-1.oraclecloud.com"
    
    if not all([access_key, secret_key, namespace]):
        raise HTTPException(status_code=500, detail="Storage credentials not configured")
        
    s3 = boto3.client('s3',
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(signature_version='s3v4')
    )
    
    try:
        url = s3.generate_presigned_url('put_object',
                                        Params={'Bucket': 'trip-planner-bucket', 'Key': filename},
                                        ExpiresIn=3600)
        
        # The public URL to read it later (assuming bucket is public, or we fetch via backend)
        read_url = f"https://objectstorage.ap-mumbai-1.oraclecloud.com/n/{namespace}/b/trip-planner-bucket/o/{filename}"
        return {"upload_url": url, "read_url": read_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trips")
def get_user_trips(login_id: str):
    conn = get_db_connection()
    s3_client = get_s3_client()
    try:
        cursor = conn.cursor()
        query = """
            SELECT DISTINCT t.id, t.title, t.source_name, t.dest_name, t.start_date, t.end_date, t.cover_image_url, t.status, t.actual_start_time, (SELECT COUNT(*) FROM trip_participants p2 WHERE p2.trip_id = t.id) as p_count, t.login_id
            FROM trips t
            LEFT JOIN trip_participants p ON t.id = p.trip_id
            WHERE t.login_id = :1 
               OR (p.email IS NOT NULL AND p.email = (SELECT email FROM users WHERE login_id = :1))
               OR (p.mobile IS NOT NULL AND p.mobile = (SELECT phone FROM users WHERE login_id = :1))
            ORDER BY t.start_date ASC
        """
        cursor.execute(query, [login_id, login_id, login_id])
        rows = cursor.fetchall()
        
        trips = []
        for row in rows:
            trips.append({
                "id": row[0],
                "title": row[1],
                "source_name": row[2],
                "dest_name": row[3],
                "start_date": row[4],
                "end_date": row[5],
                "cover_image_url": presign_url_if_needed(row[6], s3_client),
                "status": row[7],
                "actual_start_time": row[8],
                "participant_count": row[9],
                "creator_id": row[10]
            })
            
        return {"status": "success", "trips": trips}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/trips/{trip_id}")
def get_trip_details(trip_id: int):
    conn = get_db_connection()
    s3_client = get_s3_client()
    try:
        cursor = conn.cursor()
        # Fetch Trip
        cursor.execute("""
            SELECT id, title, source_name, source_lat, source_lon, dest_name, dest_lat, dest_lon, start_date, end_date, cover_image_url, login_id, status, actual_start_time, actual_end_time, end_lat, end_lon, description
            FROM trips WHERE id = :1
        """, [trip_id])
        trip_row = cursor.fetchone()
        
        if not trip_row:
            raise HTTPException(status_code=404, detail="Trip not found")
            
        trip = {
            "id": trip_row[0],
            "title": trip_row[1],
            "source": {"name": trip_row[2], "lat": trip_row[3], "lon": trip_row[4]},
            "destination": {"name": trip_row[5], "lat": trip_row[6], "lon": trip_row[7]},
            "start_date": trip_row[8],
            "end_date": trip_row[9],
            "cover_image_url": presign_url_if_needed(trip_row[10], s3_client),
            "login_id": trip_row[11],
            "status": trip_row[12],
            "actual_start_time": trip_row[13],
            "actual_end_time": trip_row[14],
            "end_lat": trip_row[15],
            "end_lon": trip_row[16],
            "description": trip_row[17],
            "checkpoints": [],
            "participants": []
        }
        
        # Fetch Checkpoints
        cursor.execute("SELECT name, lat, lon, order_idx FROM trip_checkpoints WHERE trip_id = :1 ORDER BY order_idx ASC", [trip_id])
        for cp in cursor.fetchall():
            trip["checkpoints"].append({
                "name": cp[0],
                "lat": cp[1],
                "lon": cp[2],
                "order_idx": cp[3]
            })
            
        # Fetch Participants (include login_id)
        cursor.execute("SELECT name, mobile, email, login_id FROM trip_participants WHERE trip_id = :1", [trip_id])
        for pt in cursor.fetchall():
            trip["participants"].append({
                "name": pt[0],
                "mobile": pt[1],
                "email": pt[2],
                "login_id": pt[3]
            })


        # Fetch checkins... (Existing)
        try:
            cursor.execute("SELECT participant_name, checkpoint_order_idx, checked_in_at FROM checkpoint_checkins WHERE trip_id = :1", [trip_id])
            checkins = {}
            for row in cursor.fetchall():
                key = row[0]
                if key not in checkins:
                    checkins[key] = []
                checkins[key].append({"order_idx": row[1], "checked_in_at": str(row[2]) if row[2] else None})
            trip["checkins"] = checkins
        except:
            trip["checkins"] = {}
            

        # Fetch Expenses to calculate balances
        try:
            cursor.execute("SELECT id, payer_name, amount FROM trip_expenses WHERE trip_id = :1", [trip_id])
            expenses_data = cursor.fetchall()
            balances = {}
            for exp in expenses_data:
                exp_id = exp[0]
                payer = exp[1]
                amount = exp[2]
                balances[payer] = balances.get(payer, 0) + amount
                
                cursor.execute("SELECT participant_name, amount_owed FROM trip_expense_splits WHERE expense_id = :1", [exp_id])
                splits = cursor.fetchall()
                for split in splits:
                    participant = split[0]
                    amount_owed = split[1]
                    balances[participant] = balances.get(participant, 0) - amount_owed
            trip["balances"] = balances
            
            # Calculate Settlements
            debtors = []
            creditors = []
            for name, balance in balances.items():
                balance = round(balance, 2)
                if balance < 0:
                    debtors.append({"name": name, "amount": -balance})
                elif balance > 0:
                    creditors.append({"name": name, "amount": balance})
                    
            debtors.sort(key=lambda x: x["amount"], reverse=True)
            creditors.sort(key=lambda x: x["amount"], reverse=True)
            
            settlements = []
            i, j = 0, 0
            while i < len(debtors) and j < len(creditors):
                debtor = debtors[i]
                creditor = creditors[j]
                settle_amount = min(debtor["amount"], creditor["amount"])
                
                if settle_amount > 0.01:
                    settlements.append({
                        "from": debtor["name"],
                        "to": creditor["name"],
                        "amount": round(settle_amount, 2)
                    })
                    
                debtor["amount"] -= settle_amount
                creditor["amount"] -= settle_amount
                
                if debtor["amount"] < 0.01: i += 1
                if creditor["amount"] < 0.01: j += 1
                
            trip["settlements"] = settlements
        except:
            trip["balances"] = {}
            trip["settlements"] = []


            
        return {"status": "success", "trip": trip}
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.put("/api/trips/{trip_id}")
def update_trip(trip_id: int, request: TripCreateRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Verify ownership
        cursor.execute("SELECT login_id FROM trips WHERE id = :1", [trip_id])
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Trip not found")
        if row[0] != request.login_id:
            raise HTTPException(status_code=403, detail="Not authorized to edit this trip")
            
        # Update Trip
        update_trip_sql = """
            UPDATE trips SET
                title = :1, source_name = :2, source_lat = :3, source_lon = :4,
                dest_name = :5, dest_lat = :6, dest_lon = :7, start_date = :8, 
                end_date = :9, cover_image_url = :10
            WHERE id = :11
        """
        cursor.execute(update_trip_sql, [
            request.title, request.source_name, request.source_lat, request.source_lon,
            request.dest_name, request.dest_lat, request.dest_lon, request.start_date, 
            request.end_date, request.cover_image_url, trip_id
        ])
        
        # Re-insert Checkpoints
        cursor.execute("DELETE FROM trip_checkpoints WHERE trip_id = :1", [trip_id])
        if request.checkpoints:
            chk_data = [(trip_id, c.name, c.lat, c.lon, c.order_idx) for c in request.checkpoints]
            cursor.executemany(
                "INSERT INTO trip_checkpoints (trip_id, name, lat, lon, order_idx) VALUES (:1, :2, :3, :4, :5)",
                chk_data
            )
            
        # Re-insert Participants
        cursor.execute("DELETE FROM trip_participants WHERE trip_id = :1", [trip_id])
        if request.participants:
            part_data = [(trip_id, p.name, p.mobile, p.email) for p in request.participants]
            cursor.executemany(
                "INSERT INTO trip_participants (trip_id, name, mobile, email) VALUES (:1, :2, :3, :4)",
                part_data
            )
            
        conn.commit()
        return {"status": "success", "message": "Trip updated successfully!"}
    except Exception as e:
        conn.rollback()
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
import datetime

class LocationRequest(BaseModel):
    lat: float
    lon: float
    login_id: str

@app.post("/api/trips/{trip_id}/start")
def start_trip(trip_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE trips SET status = 'In Progress', actual_start_time = CURRENT_TIMESTAMP WHERE id = :1", [trip_id])
        
        # In a real app we would query participants and send emails here.
        # For now, we mock the notification:
        cursor.execute("SELECT name, email FROM trip_participants WHERE trip_id = :1", [trip_id])
        participants = cursor.fetchall()
        for p in participants:
            if p[1]: # if email exists
                print(f"[MOCK NOTIFICATION] Email sent to {p[0]} at {p[1]}: 'The trip has started! Open the app to view live locations.'")
                
        conn.commit()
        return {"status": "success", "message": "Trip started! Participants notified."}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/trips/{trip_id}/location")
def update_location(trip_id: int, request: LocationRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # 1. Update in trips if user is owner
        cursor.execute("SELECT login_id FROM trips WHERE id = :1", [trip_id])
        trip = cursor.fetchone()
        
        if trip and trip[0] == request.login_id:
            # Maybe store owner location if we want, but let's just store all locations in trip_participants
            # Wait, the owner might not be in the participants list explicitly!
            # Let's ensure the owner is a participant, or we add owner logic.
            # Actually, we can just insert them into trip_participants on the fly if they don't exist.
            pass
            
        # Update participant location matching the login_id or email
        # If user is owner and not in participants, let's insert them.
        # For simplicity, we just look up the user's email by login_id and update their participant record.
        cursor.execute("SELECT email, phone, name FROM users WHERE login_id = :1", [request.login_id])
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        u_email = user[0]
        u_phone = user[1]
        u_name = user[2]
        
        # Try to find the participant
        find_query = "SELECT rowid FROM trip_participants WHERE trip_id = :1 AND (login_id = :2 OR email = :3 OR mobile = :4)"
        cursor.execute(find_query, [trip_id, request.login_id, u_email, u_phone])
        part_row = cursor.fetchone()
        
        if part_row:
            update_sql = "UPDATE trip_participants SET last_lat = :1, last_lon = :2, last_updated = CURRENT_TIMESTAMP WHERE rowid = :3"
            cursor.execute(update_sql, [request.lat, request.lon, part_row[0]])
        else:
            # If not found, insert them (useful for the owner who might not have added themselves)
            insert_sql = "INSERT INTO trip_participants (trip_id, login_id, name, email, mobile, last_lat, last_lon, last_updated) VALUES (:1, :2, :3, :4, :5, :6, :7, CURRENT_TIMESTAMP)"
            cursor.execute(insert_sql, [trip_id, request.login_id, u_name, u_email, u_phone, request.lat, request.lon])
            
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/trips/{trip_id}/live")
def get_live_locations(trip_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = "SELECT name, last_lat, last_lon, last_updated, login_id FROM trip_participants WHERE trip_id = :1 AND last_lat IS NOT NULL"
        cursor.execute(query, [trip_id])
        rows = cursor.fetchall()
        
        locations = []
        for r in rows:
            locations.append({
                "name": r[0],
                "lat": r[1],
                "lon": r[2],
                "last_updated": r[3],
                "login_id": r[4]
            })
            
        return {"status": "success", "locations": locations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/migrate")
def migrate_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        try: cursor.execute("ALTER TABLE trips ADD status VARCHAR2(20) DEFAULT 'Planned'")
        except Exception as e: print(f"status exists: {e}")
            
        try: cursor.execute("ALTER TABLE trips ADD actual_start_time TIMESTAMP")
        except Exception as e: print(f"actual_start_time exists: {e}")
            
        try: cursor.execute("ALTER TABLE trip_participants ADD login_id VARCHAR2(50)")
        except Exception as e: print(f"login_id exists: {e}")

        try: cursor.execute("ALTER TABLE trip_participants ADD last_lat NUMBER")
        except Exception as e: print(f"last_lat exists: {e}")

        try: cursor.execute("ALTER TABLE trip_participants ADD last_lon NUMBER")
        except Exception as e: print(f"last_lon exists: {e}")

        try: cursor.execute("ALTER TABLE trip_participants ADD last_updated TIMESTAMP")
        except Exception as e: print(f"last_updated exists: {e}")

        try: cursor.execute("ALTER TABLE trips ADD actual_end_time TIMESTAMP")
        except Exception as e: print(f"actual_end_time exists: {e}")

        try: cursor.execute("ALTER TABLE trips ADD end_lat NUMBER")
        except Exception as e: print(f"end_lat exists: {e}")

        try: cursor.execute("ALTER TABLE trips ADD end_lon NUMBER")
        except Exception as e: print(f"end_lon exists: {e}")

        try: cursor.execute("""
            CREATE TABLE checkpoint_checkins (
                id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                trip_id NUMBER NOT NULL,
                participant_name VARCHAR2(200) NOT NULL,
                checkpoint_order_idx NUMBER NOT NULL,
                checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        except Exception as e: print(f"checkpoint_checkins exists: {e}")

        conn.commit()
        return {"status": "success", "message": "Migration completed"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()

class CheckinRequest(BaseModel):
    participant_name: str
    checkpoint_order_idx: int

@app.post("/api/trips/{trip_id}/checkin")
def checkin_checkpoint(trip_id: int, request: CheckinRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # Check if already checked in
        cursor.execute(
            "SELECT COUNT(*) FROM checkpoint_checkins WHERE trip_id = :1 AND participant_name = :2 AND checkpoint_order_idx = :3",
            [trip_id, request.participant_name, request.checkpoint_order_idx]
        )
        if cursor.fetchone()[0] > 0:
            return {"status": "success", "message": "Already checked in."}
        
        cursor.execute(
            "INSERT INTO checkpoint_checkins (trip_id, participant_name, checkpoint_order_idx, checked_in_at) VALUES (:1, :2, :3, CURRENT_TIMESTAMP)",
            [trip_id, request.participant_name, request.checkpoint_order_idx]
        )
        conn.commit()
        return {"status": "success", "message": f"Checked in to checkpoint {request.checkpoint_order_idx}!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/trips/{trip_id}/cancel")
def cancel_trip(trip_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE trips SET status = 'Cancelled' WHERE id = :1 AND (status = 'Planned' OR status IS NULL)", [trip_id])
        if cursor.rowcount == 0:
            raise HTTPException(status_code=400, detail="Trip cannot be cancelled.")
        conn.commit()
        return {"status": "success", "message": "Trip cancelled successfully."}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

class EndTripRequest(BaseModel):
    end_lat: float
    end_lon: float

@app.post("/api/trips/{trip_id}/end")
def end_trip(trip_id: int, request: EndTripRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE trips SET status = 'Completed', actual_end_time = CURRENT_TIMESTAMP, end_lat = :1, end_lon = :2 WHERE id = :3 AND status = 'In Progress'",
            [request.end_lat, request.end_lon, trip_id]
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=400, detail="Trip cannot be ended. It must be In Progress.")
        conn.commit()
        return {"status": "success", "message": "Trip completed successfully!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


# --- Media Upload Endpoints ---
# Initialize the S3 client for Oracle Object Storage
def get_s3_client():
    ACCESS_KEY = os.getenv("OCI_ACCESS_KEY")
    SECRET_KEY = os.getenv("OCI_SECRET_KEY")
    NAMESPACE = os.getenv("OCI_NAMESPACE")
    REGION = os.getenv("OCI_REGION")
    
    if not all([ACCESS_KEY, SECRET_KEY, NAMESPACE, REGION]):
        print("WARNING: OCI Credentials not found in .env")
        return None

    endpoint_url = f"https://{NAMESPACE}.compat.objectstorage.{REGION}.oraclecloud.com"
    return boto3.client(
        's3',
        region_name=REGION,
        endpoint_url=endpoint_url,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        config=Config(signature_version='s3v4', s3={'addressing_style': 'path'})
    )

def presign_url_if_needed(file_url: str, s3_client) -> str:
    """Helper to convert a private Oracle Cloud storage URL into a temporary public presigned URL."""
    if not file_url or not s3_client or "oraclecloud.com" not in file_url:
        return file_url
    try:
        from urllib.parse import urlparse
        parsed = urlparse(file_url)
        path_parts = parsed.path.strip('/').split('/', 1)
        if len(path_parts) == 2:
            return s3_client.generate_presigned_url(
                ClientMethod='get_object',
                Params={'Bucket': path_parts[0], 'Key': path_parts[1]},
                ExpiresIn=3600
            )
    except Exception as e:
        print(f"Failed to generate presigned URL for {file_url}: {e}")
    return file_url

@app.get("/api/trips/{trip_id}/media/upload_url")
def get_presigned_url(trip_id: int, file_name: str, file_type: str):
    s3_client = get_s3_client()
    if not s3_client:
        raise HTTPException(status_code=500, detail="Storage not configured")
        
    bucket_name = os.getenv("OCI_BUCKET_NAME", "DKGL-BUCKET1")
    
    # Generate unique filename to prevent overwriting
    ext = file_name.split('.')[-1] if '.' in file_name else 'bin'
    unique_name = f"trip_{trip_id}/{uuid.uuid4().hex}.{ext}"
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': bucket_name,
                'Key': unique_name,
                'ContentType': file_type
            },
            ExpiresIn=3600
        )
        
        NAMESPACE = os.getenv("OCI_NAMESPACE")
        REGION = os.getenv("OCI_REGION")
        # Construct public URL for future fetching
        file_url = f"https://{NAMESPACE}.compat.objectstorage.{REGION}.oraclecloud.com/{bucket_name}/{unique_name}"
        
        return {
            "upload_url": presigned_url,
            "file_url": file_url,
            "unique_name": unique_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class MediaSaveRequest(BaseModel):
    login_id: str
    file_url: str
    file_type: str

@app.post("/api/trips/{trip_id}/media")
def save_trip_media(trip_id: int, request: MediaSaveRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO trip_media (trip_id, login_id, file_url, file_type) 
            VALUES (:1, :2, :3, :4)
            """,
            [trip_id, request.login_id, request.file_url, request.file_type]
        )
        conn.commit()
        return {"status": "success", "message": "Media saved successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/trips/{trip_id}/media")
def get_trip_media(trip_id: int):
    conn = get_db_connection()
    s3_client = get_s3_client()
    bucket_name = os.getenv("OCI_BUCKET_NAME", "DKGL-BUCKET1")
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT tm.id, tm.login_id, tm.file_url, tm.file_type, tm.uploaded_at, u.name 
            FROM trip_media tm
            LEFT JOIN users u ON tm.login_id = u.login_id
            WHERE tm.trip_id = :1 
            ORDER BY tm.uploaded_at DESC
            """,
            [trip_id]
        )
        
        media_list = []
        for row in cursor.fetchall():
            file_url = presign_url_if_needed(row[2], s3_client)
            
            media_list.append({
                "id": row[0],
                "login_id": row[1],
                "file_url": file_url,
                "file_type": row[3],
                "uploaded_at": row[4],
                "uploader_name": row[5] or row[1]
            })
            
        return {"status": "success", "media": media_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --- Expense Tracker Endpoints ---

from typing import List

class ExpenseSplit(BaseModel):
    participant_name: str
    amount_owed: float

class SavedLocationRequest(BaseModel):
    login_id: str
    name: str
    description: Optional[str] = None
    lat: float
    lon: float
    city: Optional[str] = None
    state: Optional[str] = None

class ExpenseRequest(BaseModel):
    payer_name: str
    amount: float
    description: str
    category: str
    splits: List[ExpenseSplit]

@app.post("/api/trips/{trip_id}/expenses")
def add_expense(trip_id: int, request: ExpenseRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Validate total split amount matches total expense amount
        total_split = sum(split.amount_owed for split in request.splits)
        if abs(total_split - request.amount) > 0.01:
            raise HTTPException(status_code=400, detail="Split amounts do not equal total amount")
            
        out_val = cursor.var(oracledb.NUMBER)
        # Insert expense
        cursor.execute(
            """
            INSERT INTO trip_expenses (trip_id, payer_name, amount, description, category) 
            VALUES (:1, :2, :3, :4, :5) RETURNING id INTO :6
            """,
            [trip_id, request.payer_name, request.amount, request.description, request.category, out_val]
        )
        expense_id = out_val.getvalue()[0]
        
        # Insert splits
        for split in request.splits:
            if split.amount_owed > 0:
                cursor.execute(
                    """
                    INSERT INTO trip_expense_splits (expense_id, participant_name, amount_owed)
                    VALUES (:1, :2, :3)
                    """,
                    [expense_id, split.participant_name, split.amount_owed]
                )
                
        conn.commit()
        return {"status": "success", "message": "Expense added successfully", "expense_id": expense_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/trips/{trip_id}/expenses")
def get_expenses(trip_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # 1. Fetch all expenses
        cursor.execute(
            """
            SELECT id, payer_name, amount, description, category, expense_date 
            FROM trip_expenses 
            WHERE trip_id = :1 
            ORDER BY expense_date DESC
            """,
            [trip_id]
        )
        expenses_data = cursor.fetchall()
        
        expenses = []
        balances = {} # name -> net_balance (positive means they are owed money, negative means they owe money)
        
        for exp in expenses_data:
            exp_id = exp[0]
            payer = exp[1]
            amount = exp[2]
            
            # Payer gets positive balance (they paid, so they should get it back)
            balances[payer] = balances.get(payer, 0) + amount
            
            # Fetch splits for this expense
            cursor.execute("SELECT participant_name, amount_owed FROM trip_expense_splits WHERE expense_id = :1", [exp_id])
            splits = cursor.fetchall()
            
            split_details = []
            for split in splits:
                participant = split[0]
                amount_owed = split[1]
                
                # Participant gets negative balance (they owe money)
                balances[participant] = balances.get(participant, 0) - amount_owed
                
                split_details.append({
                    "participant_name": participant,
                    "amount_owed": amount_owed
                })
                
            expenses.append({
                "id": exp_id,
                "payer_name": payer,
                "amount": amount,
                "description": exp[3],
                "category": exp[4],
                "date": exp[5],
                "splits": split_details
            })
            
        # 2. Calculate Settlements
        # Separate into debtors (who owe) and creditors (who are owed)
        debtors = []
        creditors = []
        
        for name, balance in balances.items():
            # rounding to avoid floating point issues
            balance = round(balance, 2)
            if balance < 0:
                debtors.append({"name": name, "amount": -balance})
            elif balance > 0:
                creditors.append({"name": name, "amount": balance})
                
        # Sort so largest debts/credits are processed first
        debtors.sort(key=lambda x: x["amount"], reverse=True)
        creditors.sort(key=lambda x: x["amount"], reverse=True)
        
        settlements = []
        
        i, j = 0, 0
        while i < len(debtors) and j < len(creditors):
            debtor = debtors[i]
            creditor = creditors[j]
            
            settle_amount = min(debtor["amount"], creditor["amount"])
            
            if settle_amount > 0.01: # ignore tiny fractions
                settlements.append({
                    "from": debtor["name"],
                    "to": creditor["name"],
                    "amount": round(settle_amount, 2)
                })
                
            debtor["amount"] -= settle_amount
            creditor["amount"] -= settle_amount
            
            if debtor["amount"] < 0.01: i += 1
            if creditor["amount"] < 0.01: j += 1
            

        # Fetch global participants
        cursor.execute("SELECT id FROM trips WHERE title = :1 AND login_id = :2", [f"__GLOBAL_EXPENSES_{login_id}__", login_id])
        global_trip = cursor.fetchone()
        global_participants = []
        if global_trip:
            cursor.execute("SELECT name FROM trip_participants WHERE trip_id = :1", [global_trip[0]])
            global_participants = [row[0] for row in cursor.fetchall()]
            
        return {
            "status": "success",
            "expenses": expenses,
            "settlements": settlements,
            "balances": balances,
            "global_participants": global_participants
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()




@app.get("/api/expenses/global")
def get_global_expenses(login_id: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # 1. Fetch all expenses where trip_id belongs to user
        cursor.execute(
            '''
            SELECT e.id, e.payer_name, e.amount, e.description, e.category, e.expense_date, e.trip_id
            FROM trip_expenses e
            JOIN trips t ON e.trip_id = t.id
            WHERE t.login_id = :1 
            OR t.id IN (SELECT trip_id FROM trip_participants WHERE login_id = :1 OR name = :1)
            OR e.payer_name = :1
            GROUP BY e.id, e.payer_name, e.amount, e.description, e.category, e.expense_date, e.trip_id
            ORDER BY e.expense_date DESC
            ''',
            [login_id]
        )
        expenses_data = cursor.fetchall()
        
        expenses = []
        balances = {} # name -> net_balance
        
        for exp in expenses_data:
            exp_id = exp[0]
            payer = exp[1]
            amount = exp[2]
            trip_id = exp[6]
            
            # Payer gets positive balance (they paid, so they should get it back)
            balances[payer] = balances.get(payer, 0) + amount
            
            # Fetch splits for this expense
            cursor.execute("SELECT participant_name, amount_owed FROM trip_expense_splits WHERE expense_id = :1", [exp_id])
            splits = cursor.fetchall()
            
            split_details = []
            for split in splits:
                participant = split[0]
                amount_owed = split[1]
                
                # Participant gets negative balance (they owe money)
                balances[participant] = balances.get(participant, 0) - amount_owed
                
                split_details.append({
                    "participant_name": participant,
                    "amount_owed": amount_owed
                })
                
            expenses.append({
                "id": exp_id,
                "payer_name": payer,
                "amount": amount,
                "description": exp[3],
                "category": exp[4],
                "date": exp[5],
                "trip_id": trip_id,
                "splits": split_details
            })
            
        # 2. Calculate Settlements
        debtors = []
        creditors = []
        
        for name, balance in balances.items():
            balance = round(balance, 2)
            if balance < 0:
                debtors.append({"name": name, "amount": -balance})
            elif balance > 0:
                creditors.append({"name": name, "amount": balance})
                
        debtors.sort(key=lambda x: x["amount"], reverse=True)
        creditors.sort(key=lambda x: x["amount"], reverse=True)
        
        settlements = []
        
        i, j = 0, 0
        while i < len(debtors) and j < len(creditors):
            debtor = debtors[i]
            creditor = creditors[j]
            
            settle_amount = min(debtor["amount"], creditor["amount"])
            
            if settle_amount > 0.01:
                settlements.append({
                    "from": debtor["name"],
                    "to": creditor["name"],
                    "amount": round(settle_amount, 2)
                })
                
            debtor["amount"] -= settle_amount
            creditor["amount"] -= settle_amount
            
            if debtor["amount"] < 0.01: i += 1
            if creditor["amount"] < 0.01: j += 1
            

        # Fetch global participants
        cursor.execute("SELECT id FROM trips WHERE title = :1 AND login_id = :2", [f"__GLOBAL_EXPENSES_{login_id}__", login_id])
        global_trip = cursor.fetchone()
        global_participants = []
        if global_trip:
            cursor.execute("SELECT name FROM trip_participants WHERE trip_id = :1", [global_trip[0]])
            global_participants = [row[0] for row in cursor.fetchall()]
            
        return {
            "status": "success",
            "expenses": expenses,
            "settlements": settlements,
            "balances": balances,
            "global_participants": global_participants
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/expenses/global")
def add_global_expense(login_id: str, request: ExpenseRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Find or create a global trip for this user
        global_trip_title = f"__GLOBAL_EXPENSES_{login_id}__"
        cursor.execute("SELECT id FROM trips WHERE title = :1 AND login_id = :2", [global_trip_title, login_id])
        global_trip_res = cursor.fetchone()
        
        if not global_trip_res:
            out_val = cursor.var(int)
            cursor.execute('''
                INSERT INTO trips (login_id, title, status)
                VALUES (:1, :2, 'Completed') RETURNING id INTO :3
            ''', [login_id, global_trip_title, out_val])
            trip_id = out_val.getvalue()[0]
        else:
            trip_id = global_trip_res[0]
            
        # Also ensure the payer is in the participants table for this trip
        cursor.execute("SELECT id FROM trip_participants WHERE trip_id = :1 AND name = :2", [trip_id, request.payer_name])
        if not cursor.fetchone():
            cursor.execute("INSERT INTO trip_participants (trip_id, name) VALUES (:1, :2)", [trip_id, request.payer_name])
            
        # Ensure all split targets are participants
        for s in request.splits:
            cursor.execute("SELECT id FROM trip_participants WHERE trip_id = :1 AND name = :2", [trip_id, s.participant_name])
            if not cursor.fetchone():
                cursor.execute("INSERT INTO trip_participants (trip_id, name) VALUES (:1, :2)", [trip_id, s.participant_name])
                
        # Now insert the expense
        out_val_exp = cursor.var(int)
        cursor.execute('''
            INSERT INTO trip_expenses (trip_id, payer_name, amount, description, category) 
            VALUES (:1, :2, :3, :4, :5) RETURNING id INTO :6
        ''', [trip_id, request.payer_name, request.amount, request.description, request.category, out_val_exp])
        
        expense_id = out_val_exp.getvalue()[0]
        
        split_data = [(expense_id, s.participant_name, s.amount_owed) for s in request.splits]
        cursor.executemany("INSERT INTO trip_expense_splits (expense_id, participant_name, amount_owed) VALUES (:1, :2, :3)", split_data)
        
        conn.commit()
        return {"status": "success", "message": "Global expense added", "expense_id": expense_id, "trip_id": trip_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@app.post("/api/expenses/global/participants")
def add_global_participant(login_id: str, participant: Participant):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Find or create global trip
        global_trip_title = f"__GLOBAL_EXPENSES_{login_id}__"
        cursor.execute("SELECT id FROM trips WHERE title = :1 AND login_id = :2", [global_trip_title, login_id])
        global_trip_res = cursor.fetchone()
        
        if not global_trip_res:
            out_val = cursor.var(int)
            cursor.execute('''
                INSERT INTO trips (login_id, title, status)
                VALUES (:1, :2, 'Completed') RETURNING id INTO :3
            ''', [login_id, global_trip_title, out_val])
            trip_id = out_val.getvalue()[0]
        else:
            trip_id = global_trip_res[0]
            
        # Insert participant if not exists
        cursor.execute("SELECT id FROM trip_participants WHERE trip_id = :1 AND name = :2", [trip_id, participant.name])
        if not cursor.fetchone():
            cursor.execute("INSERT INTO trip_participants (trip_id, name) VALUES (:1, :2)", [trip_id, participant.name])
            
        conn.commit()
        return {"status": "success", "message": "Participant added"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.put("/api/trips/{trip_id}/expenses/{expense_id}")
def update_expense(trip_id: int, expense_id: int, request: ExpenseRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Validate total split amount matches total expense amount
        total_split = sum(split.amount_owed for split in request.splits)
        if abs(total_split - request.amount) > 0.01:
            raise HTTPException(status_code=400, detail="Split amounts do not equal total amount")
            
        # Update expense
        cursor.execute(
            """
            UPDATE trip_expenses 
            SET payer_name = :1, amount = :2, description = :3, category = :4 
            WHERE id = :5 AND trip_id = :6
            """,
            [request.payer_name, request.amount, request.description, request.category, expense_id, trip_id]
        )
        
        # Delete old splits
        cursor.execute("DELETE FROM trip_expense_splits WHERE expense_id = :1", [expense_id])
        
        # Insert new splits
        for split in request.splits:
            if split.amount_owed > 0:
                cursor.execute(
                    """
                    INSERT INTO trip_expense_splits (expense_id, participant_name, amount_owed)
                    VALUES (:1, :2, :3)
                    """,
                    [expense_id, split.participant_name, split.amount_owed]
                )
                
        conn.commit()
        return {"status": "success", "message": "Expense updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.delete("/api/trips/{trip_id}/expenses/{expense_id}")
def delete_expense(trip_id: int, expense_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM trip_expenses WHERE id = :1 AND trip_id = :2", [expense_id, trip_id])
        conn.commit()
        return {"status": "success", "message": "Expense deleted"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/locations")
def get_locations(login_id: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, name, description, lat, lon, city, state 
            FROM saved_locations 
            WHERE login_id = :1 
            ORDER BY created_at DESC
            """, 
            [login_id]
        )
        locations = []
        for row in cursor.fetchall():
            locations.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "lat": row[3],
                "lon": row[4],
                "city": row[5],
                "state": row[6]
            })
        return {"status": "success", "locations": locations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/locations")
def save_location(request: SavedLocationRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        out_val = cursor.var(oracledb.NUMBER)
        cursor.execute(
            """
            INSERT INTO saved_locations (login_id, name, description, lat, lon, city, state)
            VALUES (:1, :2, :3, :4, :5, :6, :7) RETURNING id INTO :8
            """,
            [request.login_id, request.name, request.description, request.lat, request.lon, request.city, request.state, out_val]
        )
        loc_id = out_val.getvalue()[0]
        conn.commit()
        return {"status": "success", "id": loc_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.delete("/api/locations/{location_id}")
def delete_location(location_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM saved_locations WHERE id = :1", [location_id])
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/server-metrics")
def get_server_metrics():
    import subprocess
    try:
        free = subprocess.getoutput("free -h")
        df = subprocess.getoutput("df -h /")
        top = subprocess.getoutput("top -b -n 1 | head -n 15")
        uptime = subprocess.getoutput("uptime")
        return {"free": free, "df": df, "top": top, "uptime": uptime}
    except Exception as e:
        return {"error": str(e)}

import json
import uuid
import base64
from fastapi import Request
from pydantic import BaseModel
from webauthn import generate_registration_options, options_to_json, verify_registration_response
from webauthn import generate_authentication_options, verify_authentication_response
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    UserVerificationRequirement,
    ResidentKeyRequirement,
    RegistrationCredential,
    AuthenticationCredential,
    AuthenticatorAttachment
)

# In-memory challenge store (in production, use Redis or DB)
CHALLENGES = {}

RP_ID = os.getenv("RP_ID", "80.225.208.24.nip.io")
RP_NAME = "DKGL Trip Planner"
ORIGIN = os.getenv("ORIGIN", f"https://{RP_ID}")

class VerifyRegisterRequest(BaseModel):
    login_id: str
    credential: dict

class VerifyLoginRequest(BaseModel):
    auth_session_id: str
    credential: dict

@app.get("/api/auth/register-biometric/options")
def register_biometric_options(login_id: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM users WHERE login_id = :1", [login_id])
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if already registered
        cursor.execute("SELECT COUNT(*) FROM user_credentials WHERE login_id = :1", [login_id])
        if cursor.fetchone()[0] > 0:
            raise HTTPException(status_code=400, detail="Biometric already enabled")

        options = generate_registration_options(
            rp_id=RP_ID,
            rp_name=RP_NAME,
            user_id=login_id.encode("utf-8"),
            user_name=login_id,
            user_display_name=user[0],
            authenticator_selection=AuthenticatorSelectionCriteria(
                authenticator_attachment=AuthenticatorAttachment.PLATFORM, # Force internal (face/finger)
                user_verification=UserVerificationRequirement.REQUIRED,
                resident_key=ResidentKeyRequirement.REQUIRED,
            ),
            supported_pub_key_algs=[-7, -257],
            timeout=60000
        )
        
        CHALLENGES[f"reg_{login_id}"] = options.challenge
        
        return json.loads(options_to_json(options))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/auth/register-biometric/verify")
def register_biometric_verify(req: VerifyRegisterRequest):
    challenge = CHALLENGES.get(f"reg_{req.login_id}")
    if not challenge:
        raise HTTPException(status_code=400, detail="Challenge expired or not found")
        
    try:
        verification = verify_registration_response(
            credential=req.credential,
            expected_challenge=challenge,
            expected_origin=ORIGIN,
            expected_rp_id=RP_ID,
            require_user_verification=True
        )
        
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            # Webauthn library returns raw bytes, we store as base64
            cred_id = base64.b64encode(verification.credential_id).decode('utf-8')
            pub_key = base64.b64encode(verification.credential_public_key).decode('utf-8')
            
            cursor.execute(
                """
                INSERT INTO user_credentials (login_id, credential_id, public_key, sign_count)
                VALUES (:1, :2, :3, :4)
                """,
                [req.login_id, cred_id, pub_key, verification.sign_count]
            )
            conn.commit()
            
            if f"reg_{req.login_id}" in CHALLENGES:
                del CHALLENGES[f"reg_{req.login_id}"]
            return {"status": "success", "message": "Biometric login enabled!"}
        finally:
            conn.close()
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

@app.get("/api/auth/login-biometric/options")
def login_biometric_options():
    try:
        options = generate_authentication_options(
            rp_id=RP_ID,
            user_verification=UserVerificationRequirement.REQUIRED,
            timeout=60000
        )
        
        session_id = str(uuid.uuid4())
        CHALLENGES[f"auth_{session_id}"] = options.challenge
        
        res = json.loads(options_to_json(options))
        res["auth_session_id"] = session_id
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login-biometric/verify")
def login_biometric_verify(req: VerifyLoginRequest):
    challenge = CHALLENGES.get(f"auth_{req.auth_session_id}")
    if not challenge:
        raise HTTPException(status_code=400, detail="Challenge expired or not found")
        
    # We must find the credential_id in our DB
    raw_id = req.credential.get("rawId", "")
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        user_handle = req.credential.get("response", {}).get("userHandle")
        if not user_handle:
            raise HTTPException(status_code=400, detail="No user handle found. Not a discoverable credential.")
            
        login_id = base64.b64decode(user_handle + '==').decode('utf-8')
        
        cursor.execute("SELECT credential_id, public_key, sign_count FROM user_credentials WHERE login_id = :1", [login_id])
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Credential not found in DB")
            
        db_cred_id, db_pub_key, db_sign_count = row
        
        # If public_key is a LOB object, we must read it
        if hasattr(db_pub_key, "read"):
            db_pub_key = db_pub_key.read()
        
        verification = verify_authentication_response(
            credential=req.credential,
            expected_challenge=challenge,
            expected_origin=ORIGIN,
            expected_rp_id=RP_ID,
            credential_public_key=base64.b64decode(db_pub_key),
            credential_current_sign_count=db_sign_count,
            require_user_verification=True
        )
        
        # Update sign count
        cursor.execute("UPDATE user_credentials SET sign_count = :1 WHERE login_id = :2", [verification.new_sign_count, login_id])
        
        # Fetch user details
        cursor.execute("SELECT login_id, name, phone, role FROM users WHERE login_id = :1", [login_id])
        user_row = cursor.fetchone()
        conn.commit()
        
        if f"auth_{req.auth_session_id}" in CHALLENGES:
            del CHALLENGES[f"auth_{req.auth_session_id}"]
        
        return {
            "status": "success",
            "message": f"Welcome back, {user_row[1]}!",
            "name": user_row[1],
            "login_id": user_row[0],
            "phone": user_row[2],
            "role": user_row[3]
        }
    except Exception as e:
        conn.rollback()
        print(f"Login failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Login failed: {str(e)}")
    finally:
        conn.close()

@app.get("/api/auth/biometric-status")
def biometric_status(login_id: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM user_credentials WHERE login_id = :1", [login_id])
        count = cursor.fetchone()[0]
        return {"status": "success", "enabled": count > 0}
    finally:
        conn.close()

@app.delete("/api/auth/disable-biometric")
def disable_biometric(login_id: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM user_credentials WHERE login_id = :1", [login_id])
        conn.commit()
        return {"status": "success", "message": "Biometric login disabled"}
    finally:
        conn.close()

@app.get("/api/dev/logs")
def get_logs():
    import subprocess
    try:
        logs = subprocess.getoutput("tail -n 100 backend.log")
        return {"logs": logs}
    except Exception as e:
        return {"error": str(e)}


class RoleUpdateRequest(BaseModel):
    role: str

@app.get("/api/users/search")
def search_users(q: str = "", login_id: str = ""):
    """Search registered users by name (case-insensitive). Excludes the requesting user."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        if not q.strip():
            return {"users": []}
        cursor.execute(
            "SELECT login_id, name, phone FROM users WHERE UPPER(name) LIKE UPPER(:1) AND login_id != :2 AND ROWNUM <= 10",
            [f"%{q.strip()}%", login_id or ""]
        )
        results = cursor.fetchall()
        return {"users": [{"login_id": r[0], "name": r[1], "phone": r[2]} for r in results]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/admin/users")

def get_all_users(requester_id: str):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT role FROM users WHERE login_id = :1", [requester_id])
        row = cursor.fetchone()
        if not row or row[0] != 'ADMIN':
            raise HTTPException(status_code=403, detail="Unauthorized")
            
        cursor.execute("SELECT login_id, name, email, phone, role FROM users")
        users = []
        for r in cursor.fetchall():
            users.append({
                "login_id": r[0],
                "name": r[1],
                "email": r[2],
                "phone": r[3],
                "role": r[4]
            })
        return users
    finally:
        conn.close()

@app.put("/api/admin/users/{target_login_id}/role")
def update_user_role(target_login_id: str, requester_id: str, request: RoleUpdateRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT role FROM users WHERE login_id = :1", [requester_id])
        row = cursor.fetchone()
        if not row or row[0] != 'ADMIN':
            raise HTTPException(status_code=403, detail="Unauthorized")
            
        cursor.execute("UPDATE users SET role = :1 WHERE login_id = :2", [request.role, target_login_id])
        conn.commit()
        return {"status": "success"}
    finally:
        conn.close()

# --- Finance Analytics Routes ---

@app.get("/api/finance/factors")
def get_finance_factors():
    try:
        import joblib
        import os
        model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'finance_pipeline/active_xgb_model.joblib'))
        if not os.path.exists(model_path):
            return []
            
        model = joblib.load(model_path)
        importances = model.feature_importances_
        if hasattr(model, 'feature_names_in_'):
            feature_names = model.feature_names_in_
        else:
            feature_names = [f"Factor {i}" for i in range(len(importances))]
            
        factors = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)[:10]
        
        return [
            {
                "factor_name": name,
                "impact_weight": float(imp * 100) # percentage
            } for name, imp in factors
        ]
    except Exception as e:
        print(f"Error fetching factors: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/api/finance/predictions")
def get_finance_predictions():
    try:
        from finance_pipeline.db import SessionLocal, V2Prediction
        db = SessionLocal()
        predictions = db.query(V2Prediction).order_by(V2Prediction.date.desc()).limit(7).all()
        return [
            {
                "date": p.date.strftime("%Y-%m-%d") if p.date else None,
                "prob_crash": p.prob_crash,
                "prob_down": p.prob_down,
                "prob_up": p.prob_up,
                "prob_boom": p.prob_boom,
                "signal": p.signal,
                "confidence": p.confidence
            } for p in predictions
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/finance/indices")
def get_current_indices():
    try:
        from finance_pipeline.db import SessionLocal, RawMarketDataV2
        db = SessionLocal()
        nifty = db.query(RawMarketDataV2).filter(RawMarketDataV2.ticker == '^NSEI').order_by(RawMarketDataV2.date.desc()).first()
        sensex = db.query(RawMarketDataV2).filter(RawMarketDataV2.ticker == '^BSESN').order_by(RawMarketDataV2.date.desc()).first()
        
        # Return nifty and sensex open and close prices, along with the date of the market record formatted as 'YYYY-MM-DD'
        return {
            "nifty50": float(round(nifty.close_price, 2)) if nifty else 0.0,
            "nifty50_open": float(round(nifty.open_price, 2)) if nifty else 0.0,
            "nifty50_date": nifty.date.strftime("%Y-%m-%d") if nifty and nifty.date else None,
            "sensex": float(round(sensex.close_price, 2)) if sensex else 0.0,
            "sensex_open": float(round(sensex.open_price, 2)) if sensex else 0.0,
            "sensex_date": sensex.date.strftime("%Y-%m-%d") if sensex and sensex.date else None
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/finance/history")
def get_market_history():
    try:
        from finance_pipeline.db import SessionLocal, RawMarketDataV2
        db = SessionLocal()
        records = db.query(RawMarketDataV2).order_by(RawMarketDataV2.date.desc()).limit(360).all()
        # Since it's two tickers, we limit to 360 to get ~180 days of history
        records.reverse()
        history = {}
        for r in records:
            date_str = r.date.strftime("%Y-%m-%d")
            if date_str not in history:
                history[date_str] = {"date": date_str}
            if r.ticker == '^NSEI':
                history[date_str]['nifty_open'] = r.open_price
                history[date_str]['nifty_close'] = r.close_price
            elif r.ticker == '^BSESN':
                history[date_str]['sensex_open'] = r.open_price
                history[date_str]['sensex_close'] = r.close_price
        
        return list(history.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import psutil
import time

BOOT_TIME = time.time()

@app.get("/api/system/health")
def system_health():
    try:
        from finance_pipeline.db import SessionLocal, SystemJobStatus
        db = SessionLocal()
        
        # Ping DB & Get Metrics
        db_status = "Online"
        db_size_gb = 0.0
        top_tables = []
        try:
            from sqlalchemy import text
            db.execute(text("SELECT 1"))
            
            dialect = db.bind.dialect.name
            if dialect == 'postgresql':
                # DB Size
                db_size_res = db.execute(text("SELECT pg_database_size(current_database())")).fetchone()
                if db_size_res:
                    db_size_gb = round(db_size_res[0] / (1024**3), 2)
                    
                # Top Tables
                tables_query = text("""
                    SELECT relname as table_name, pg_total_relation_size(relid) as size_bytes
                    FROM pg_catalog.pg_statio_user_tables
                    ORDER BY pg_total_relation_size(relid) DESC
                    LIMIT 5;
                """)
                tables_res = db.execute(tables_query).fetchall()
                top_tables = [{"name": row[0], "size_mb": round(row[1] / (1024**2), 2)} for row in tables_res]
            
            elif dialect == 'sqlite':
                import os
                db_path = str(db.bind.url).replace('sqlite:///', '')
                # handle relative path sqlite:///./finance.db
                if db_path.startswith('./'):
                    db_path = db_path[2:]
                
                if os.path.exists(db_path):
                    db_size_gb = round(os.path.getsize(db_path) / (1024**3), 4)
                
                tables_query = text("SELECT name FROM sqlite_master WHERE type='table';")
                tables_res = db.execute(tables_query).fetchall()
                top_tables = [{"name": row[0], "size_mb": 0.0} for row in tables_res[:5]]
            
        except Exception as e:
            db_status = f"Offline: ({type(e).__name__}) {str(e)}"
        
        # Get Job Statuses
        jobs = db.query(SystemJobStatus).all()
        job_data = []
        for j in jobs:
            job_data.append({
                "job_name": j.job_name,
                "status": j.status,
                "last_run_at": j.last_run_at.isoformat() if j.last_run_at else None,
                "error_message": j.error_message,
                "last_finished_at": j.last_finished_at.isoformat() if j.last_finished_at else None,
                "last_run_summary": j.last_run_summary
            })
            
        db.close()
        
        # System Metrics
        cpu_usage = psutil.cpu_percent(interval=0.1)
        cpu_cores = psutil.cpu_count(logical=True)
        ram = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        uptime_seconds = int(time.time() - psutil.boot_time())
        
        # Top processes by CPU and Memory
        top_processes = []
        try:
            procs = []
            for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'memory_info']):
                try:
                    info = p.info
                    procs.append(info)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            # Sort by memory usage (more stable than cpu_percent on single snapshot)
            procs.sort(key=lambda x: x.get('memory_percent', 0) or 0, reverse=True)
            for proc in procs[:8]:
                mem_mb = round((proc.get('memory_info').rss if proc.get('memory_info') else 0) / (1024**2), 1)
                top_processes.append({
                    "name": proc.get('name', 'Unknown'),
                    "pid": proc.get('pid', 0),
                    "cpu_percent": round(proc.get('cpu_percent', 0) or 0, 1),
                    "memory_percent": round(proc.get('memory_percent', 0) or 0, 1),
                    "memory_mb": mem_mb
                })
        except Exception:
            pass
        
        return {
            "server": {
                "cpu_usage_percent": cpu_usage,
                "cpu_cores": cpu_cores,
                "ram_usage_percent": ram.percent,
                "ram_total_gb": round(ram.total / (1024**3), 2),
                "disk_usage_percent": disk.percent,
                "disk_total_gb": round(disk.total / (1024**3), 2),
                "uptime_seconds": uptime_seconds,
                "db_status": db_status
            },
            "database": {
                "size_gb": db_size_gb,
                "top_tables": top_tables
            },
            "jobs": job_data,
            "top_processes": top_processes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
