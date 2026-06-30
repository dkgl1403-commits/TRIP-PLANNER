import oracledb
import os
from dotenv import load_dotenv

load_dotenv('/home/ubuntu/TRIP_Planner/.env')
wallet_password = os.getenv('DB_PASSWORD')
conn = oracledb.connect(
    user=os.getenv('DB_USER'), 
    password=wallet_password, 
    dsn='dkgloracledb1_high', 
    config_dir='/home/ubuntu/wallet', 
    wallet_location='/home/ubuntu/wallet', 
    wallet_password=wallet_password
)
cur = conn.cursor()
cur.execute("SELECT trip_id, name, creator_id FROM trips WHERE creator_id = '9602273728'")
print('User Trips:', cur.fetchall())
