import paramiko

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("80.225.208.24", username="ubuntu", pkey=key)

stdin, stdout, stderr = client.exec_command("cat /etc/nginx/sites-available/trip_planner_uat")
print(stdout.read().decode("utf-8"))
client.close()
