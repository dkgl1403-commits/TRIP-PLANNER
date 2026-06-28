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
cursor.execute("SELECT column_name, data_type FROM user_tab_columns WHERE table_name = 'USERS'")
print(cursor.fetchall())
conn.close()
