import paramiko

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("80.225.208.24", username="ubuntu", pkey=key)

cmd = """
cd /home/ubuntu/TRIP_Planner_UAT/backend
source ../.env
python3 -c "
import time
from hr_analytics.db import SessionLocal
from hr_analytics.ml_engine import calculate_insights_for_all

db = SessionLocal()
start = time.time()
print('Starting ML Engine...')
try:
    res = calculate_insights_for_all(db)
    print('Finished:', res)
except Exception as e:
    import traceback
    traceback.print_exc()
print('Time taken:', time.time() - start)
"
"""
stdin, stdout, stderr = client.exec_command(cmd, timeout=30)
try:
    print(stdout.read().decode("utf-8"))
    print(stderr.read().decode("utf-8"))
except Exception as e:
    print("Timeout or error:", e)
client.close()
