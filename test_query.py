import oracledb
import os
from dotenv import load_dotenv

load_dotenv('.env')

conn = oracledb.connect(
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    dsn='dkgloracledb1_high',
    config_dir=os.getenv('DB_WALLET_DIR'),
    wallet_location=os.getenv('DB_WALLET_DIR')
)

cur = conn.cursor()
cur.execute("SELECT trip_id, name, creator_id FROM trips WHERE creator_id = '9602273728'")
print("Trips where creator_id = 9602273728:")
print(cur.fetchall())

cur.execute("SELECT trip_id, name, creator_id FROM trips")
print("All trips:")
print(cur.fetchall())

cur.execute("SELECT t.trip_id, t.name, t.creator_id FROM trips t JOIN trip_participants p ON t.trip_id = p.trip_id WHERE p.participant_name = '9602273728'")
print("Trips where 9602273728 is a participant:")
print(cur.fetchall())
