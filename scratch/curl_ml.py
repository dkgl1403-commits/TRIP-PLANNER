import paramiko

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("80.225.208.24", username="ubuntu", pkey=key)

cmd = """
curl -X POST http://127.0.0.1:8001/api/employee-dashboard/ml/run -v
"""
stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:")
print(stdout.read().decode("utf-8"))
print("STDERR:")
print(stderr.read().decode("utf-8"))
client.close()
