import paramiko

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("80.225.208.24", username="ubuntu", pkey=key)

stdin, stdout, stderr = client.exec_command("sudo tail -n 50 /var/log/nginx/access.log")
print(stdout.read().decode("utf-8"))
client.close()
