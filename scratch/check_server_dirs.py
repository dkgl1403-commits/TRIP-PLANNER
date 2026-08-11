import paramiko
import sys

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=10)
    stdin, stdout, stderr = client.exec_command("ls -la /home/ubuntu")
    print(stdout.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
