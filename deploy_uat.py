import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='ignore')
sys.stderr.reconfigure(encoding='utf-8', errors='ignore')

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=10)
    
    print("=== Pulling code ===")
    stdin, stdout, stderr = client.exec_command("cd /home/ubuntu/TRIP_Planner_UAT && git pull origin uat")
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))

    print("=== Building Frontend ===")
    stdin, stdout, stderr = client.exec_command("cd /home/ubuntu/TRIP_Planner_UAT/frontend && npm run build")
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))

    print("=== Installing Server-Side Neural TTS Dependencies ===")
    stdin, stdout, stderr = client.exec_command("pip install edge-tts gTTS")
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))

    print("=== Seeding Database ===")
    stdin, stdout, stderr = client.exec_command("cd /home/ubuntu/TRIP_Planner_UAT/backend && PYTHONPATH=. python3 learning/seed.py")
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))

    print("=== Restarting Backend ===")
    stdin, stdout, stderr = client.exec_command("sudo pkill -f 'uvicorn main:app --host 0.0.0.0 --port 8001' || true")
    stdout.read()
    stdin, stdout, stderr = client.exec_command("cd /home/ubuntu/TRIP_Planner_UAT/backend && nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 > /tmp/uvicorn_uat.log 2>&1 < /dev/null &")
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))
    
    print("Deployment to UAT complete.")
finally:
    client.close()
