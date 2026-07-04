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
        cursor.execute("SELECT login_id, name, password_hash, phone FROM users WHERE login_id = :1 OR phone = :2", [request.login_id, request.login_id])
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
            "phone": row[3]
        }
    finally:
        conn.close()

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
            
        return {
            "status": "success",
            "expenses": expenses,
            "settlements": settlements,
            "balances": balances
        }
    except Exception as e:
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

