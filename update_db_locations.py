import oracledb
import os
from dotenv import load_dotenv

load_dotenv(r'c:\Personal\Projects\TRIP_Planner\.env')

def run():
    wallet_password = os.getenv("DB_PASSWORD")
    dsn = "dkgloracledb1_high"
    wallet_dir = r"C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1"
    
    conn = oracledb.connect(
        user="ADMIN",
        password=wallet_password,
        dsn=dsn,
        config_dir=wallet_dir,
        wallet_location=wallet_dir,
        wallet_password=wallet_password
    )
    cursor = conn.cursor()
    
    print("Creating saved_locations table...")
    try:
        cursor.execute("""
            CREATE TABLE saved_locations (
                id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                login_id VARCHAR2(50) NOT NULL,
                name VARCHAR2(255) NOT NULL,
                description VARCHAR2(1000),
                lat NUMBER,
                lon NUMBER,
                city VARCHAR2(255),
                state VARCHAR2(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("saved_locations table created successfully!")
    except Exception as e:
        print(f"saved_locations table already exists or error: {e}")
        
    conn.commit()
    conn.close()

if __name__ == '__main__':
    run()
