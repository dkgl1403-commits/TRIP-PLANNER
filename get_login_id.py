import os, oracledb
from dotenv import load_dotenv
load_dotenv('.env')
conn = oracledb.connect(
    user='ADMIN', 
    password=os.environ['DB_PASSWORD'], 
    dsn='dkgloracledb1_high', 
    config_dir='Wallet_DKGLORACLEDB1', 
    wallet_location='Wallet_DKGLORACLEDB1', 
    wallet_password=os.environ['DB_PASSWORD']
)
cur = conn.cursor()
cur.execute("SELECT login_id FROM users WHERE ROWNUM = 1")
print(cur.fetchone()[0])
