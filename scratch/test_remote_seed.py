import paramiko

key = paramiko.RSAKey.from_private_key_file(r'C:\Users\dkgl1\.ssh\server_key.pem')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname='80.225.208.24', username='ubuntu', pkey=key)

cmd = "cd /home/ubuntu/TRIP_Planner_UAT/backend && PYTHONPATH=. python3 learning/seed.py"
stdin, stdout, stderr = client.exec_command(cmd)
print("=== SEED OUTPUT ===")
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

cmd2 = "curl -s http://localhost:8001/api/learning/classes"
stdin, stdout, stderr = client.exec_command(cmd2)
print("=== API RESPONSE FOR CLASSES (PORT 8001) ===")
print(stdout.read().decode('utf-8'))

client.close()
