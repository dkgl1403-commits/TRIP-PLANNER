import sys
import paramiko
import time

sys.stdout.reconfigure(encoding='utf-8', errors='ignore')
sys.stderr.reconfigure(encoding='utf-8', errors='ignore')

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=30)

def run(cmd, label=""):
    if label:
        print(f"\n=== {label} ===")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    if out.strip():
        print(out)
    if err.strip():
        print("[STDERR]", err)
    return out

# Step 1: Stop & remove old broken containers
run("sudo docker rm -f shadowbox watchtower 2>/dev/null || true", "Cleanup Old Containers")
run("sudo rm -rf /opt/outline", "Cleanup Old Outline Config")

# Step 2: Register QEMU binfmt for cross-architecture Docker
run("sudo docker run --rm --privileged multiarch/qemu-user-static --reset -p yes 2>/dev/null || true", "Register QEMU binfmt")

# Step 3: Pull shadowbox image with explicit --platform linux/amd64
run("sudo docker pull --platform linux/amd64 quay.io/outline/shadowbox:stable", "Pull Shadowbox (amd64 via QEMU)")

# Step 4: Run the Outline install script again
print("\n=== Running Outline Server Installation ===")
cmd = 'sudo SB_IMAGE=quay.io/outline/shadowbox:stable bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)"'
stdin, stdout, stderr = client.exec_command(cmd, timeout=120)

while True:
    line = stdout.readline()
    if not line:
        break
    print(line, end="")

err = stderr.read().decode('utf-8', errors='ignore')
if err.strip():
    print("\n[STDERR]", err)

# Step 5: Check if shadowbox is running now
time.sleep(5)
run("sudo docker ps", "Docker Container Status")
run("sudo docker logs shadowbox --tail 5 2>&1", "Shadowbox Recent Logs")
run("cat /opt/outline/access.txt 2>/dev/null || echo 'No access.txt found'", "Outline Access Key")

client.close()
