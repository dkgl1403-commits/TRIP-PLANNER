import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8', errors='ignore')
sys.stderr.reconfigure(encoding='utf-8', errors='ignore')

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=10)

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

run("sudo docker ps -a", "Docker Containers")
run("sudo docker logs shadowbox --tail 10 2>&1", "Shadowbox Logs")
run("cat /opt/outline/access.txt 2>/dev/null || echo NO_ACCESS_FILE", "Outline Access Key")
run("cat /opt/outline/shadowbox_server_config.json 2>/dev/null || echo NO_CONFIG", "Outline Config")
run("sudo ss -tlnp", "Listening Ports")

client.close()
