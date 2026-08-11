import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8', errors='ignore')
sys.stderr.reconfigure(encoding='utf-8', errors='ignore')

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=30)

print("=== Cleanup Old Failed Outline Containers ===")
cleanup_cmd = "sudo docker rm -f shadowbox watchtower || true; sudo rm -rf /opt/outline"
client.exec_command(cleanup_cmd)

print("=== Installing Outline Server for ARM64 Architecture ===")
cmd = 'sudo DOCKER_DEFAULT_PLATFORM=linux/arm64 bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)"'
stdin, stdout, stderr = client.exec_command(cmd)

while True:
    line = stdout.readline()
    if not line:
        break
    print(line, end="")

err = stderr.read().decode('utf-8', errors='ignore')
if err:
    print("\n[STDERR]", err)

client.close()
