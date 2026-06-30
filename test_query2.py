import oracledb
import os
from dotenv import load_dotenv

load_dotenv('.env')
wallet_password = os.getenv('DB_PASSWORD')
conn = oracledb.connect(
    user=os.getenv('DB_USER'),
    password=wallet_password,
    dsn='dkgloracledb1_high',
    config_dir=os.getenv('DB_WALLET_DIR', r'C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1'),
    wallet_location=os.getenv('DB_WALLET_DIR', r'C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1'),
    wallet_password=wallet_password
)
cur = conn.cursor()
cur.execute("SELECT id, title, login_id FROM trips")
all_trips = cur.fetchall()
print("All trips in DB:", all_trips)
