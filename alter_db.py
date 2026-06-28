import oracledb
import os
from dotenv import load_dotenv

load_dotenv('.env')

conn = oracledb.connect(
    user='ADMIN', 
    password=os.getenv('DB_PASSWORD'), 
    dsn='dkgloracledb1_high', 
    config_dir=r'C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1', 
    wallet_location=r'C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1', 
    wallet_password=os.getenv('DB_PASSWORD')
)
cursor = conn.cursor()
try:
    cursor.execute("ALTER TABLE users ADD (login_id VARCHAR2(20) UNIQUE)")
    print("Column added.")
except Exception as e:
    print(e)
    
try:
    cursor.execute("UPDATE users SET login_id = 'JD12345' WHERE email = 'john.doe@tripplanner.com'")
    conn.commit()
    print("Test user updated.")
except Exception as e:
    print(e)
    
conn.close()
