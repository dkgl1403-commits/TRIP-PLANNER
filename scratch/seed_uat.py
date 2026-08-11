import paramiko

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=10)

cmd = "cd /home/ubuntu/TRIP_Planner_UAT/backend && export PYTHONPATH=. && python3 learning/seed.py"
stdin, stdout, stderr = client.exec_command(cmd)

print(stdout.read().decode("utf-8", errors="replace"))
print(stderr.read().decode("utf-8", errors="replace"))

client.close()
