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
from main import system_health
start = time.time()
print('Starting system_health()...')
res = system_health()
print('Finished in', time.time() - start)
print(res)
"
"""
stdin, stdout, stderr = client.exec_command(cmd, timeout=10)
try:
    print("STDOUT:")
    print(stdout.read().decode("utf-8"))
    print("STDERR:")
    print(stderr.read().decode("utf-8"))
except Exception as e:
    print("Timeout or error:", e)
client.close()
