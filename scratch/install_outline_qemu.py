import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8', errors='ignore')
sys.stderr.reconfigure(encoding='utf-8', errors='ignore')

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=30)

print("=== Step 1: Installing QEMU x86_64 Emulation for ARM64 Server ===")
cmd_qemu = "sudo apt-get update && sudo apt-get install -y qemu-user-static binfmt-support && sudo docker run --rm --privileged multiarch/qemu-user-static --reset -p yes"
stdin, stdout, stderr = client.exec_command(cmd_qemu)
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

print("=== Step 2: Cleanup Old Failed Outline Containers ===")
cleanup_cmd = "sudo docker rm -f shadowbox watchtower || true; sudo rm -rf /opt/outline"
client.exec_command(cleanup_cmd)

print("=== Step 3: Running Official Outline Server Installation Script ===")
cmd = 'sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)"'
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
