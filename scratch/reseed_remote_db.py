import paramiko

key = paramiko.RSAKey.from_private_key_file(r'C:\Users\dkgl1\.ssh\server_key.pem')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname='80.225.208.24', username='ubuntu', pkey=key)

cmd = "cd /home/ubuntu/TRIP_Planner_UAT && python3 backend/learning/seed.py"
stdin, stdout, stderr = client.exec_command(cmd)
print("=== SEED OUTPUT ===")
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

cmd_restart = "sudo systemctl restart trip-planner-backend || pkill -f 'python3 main.py' || true"
client.exec_command(cmd_restart)

cmd2 = "curl -s http://localhost:8000/api/learning/classes"
stdin, stdout, stderr = client.exec_command(cmd2)
print("=== NEW API RESPONSE FOR CLASSES ===")
print(stdout.read().decode('utf-8'))

client.close()
