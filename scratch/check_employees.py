import paramiko

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("80.225.208.24", username="ubuntu", pkey=key)

cmd = """
cd /home/ubuntu/TRIP_Planner_UAT/backend
source ../.env
python3 -c "
from hr_analytics.db import SessionLocal, Employee
print(SessionLocal().query(Employee).count())
"
"""
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode("utf-8"))
print(stderr.read().decode("utf-8"))
client.close()
