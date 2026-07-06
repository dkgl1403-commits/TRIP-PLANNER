import os
import oracledb
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env", override=True)

password = os.getenv("DB_PASSWORD")
dsn = "dkgloracledb1_high"
wallet_dir = r"C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1"

try:
    conn = oracledb.connect(
        user="ADMIN",
        password=password,
        dsn=dsn,
        config_dir=wallet_dir,
        wallet_location=wallet_dir,
        wallet_password=password
    )
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE user_credentials (
        id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        login_id VARCHAR2(255) NOT NULL,
        credential_id VARCHAR2(1000) NOT NULL,
        public_key CLOB NOT NULL,
        sign_count NUMBER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    print("Table user_credentials created successfully")
    conn.commit()
except Exception as e:
    print("Error:", e)
finally:
    if 'conn' in locals():
        conn.close()
