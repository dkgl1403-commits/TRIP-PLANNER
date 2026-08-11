import sys
import paramiko

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
        print("[INFO]", err)
    return out

# Step 1: Read the keys
server_priv = run("sudo cat /etc/wireguard/server_private.key").strip()
server_pub = run("sudo cat /etc/wireguard/server_public.key").strip()
client_priv = run("sudo cat /etc/wireguard/client_private.key").strip()
client_pub = run("sudo cat /etc/wireguard/client_public.key").strip()

print(f"Server Private Key: {server_priv}")
print(f"Server Public Key:  {server_pub}")
print(f"Client Private Key: {client_priv}")
print(f"Client Public Key:  {client_pub}")

# Step 2: Stop any existing WireGuard
run("sudo systemctl stop wg-quick@wg0 2>/dev/null || true", "Stop Existing WireGuard")

# Step 3: Write CORRECT server config (fixed interface name)
server_config = f"""[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = {server_priv}
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o enp0s6 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o enp0s6 -j MASQUERADE

[Peer]
PublicKey = {client_pub}
AllowedIPs = 10.0.0.2/32
"""

# Write via heredoc to avoid shell escaping issues
write_cmd = f"""sudo tee /etc/wireguard/wg0.conf << 'WGEOF'
{server_config}WGEOF"""
run(write_cmd, "Write Fixed Server Config")
run("sudo chmod 600 /etc/wireguard/wg0.conf", "Secure Config")

# Step 4: Open firewall port 51820/UDP on the server (iptables)
run("sudo iptables -I INPUT -p udp --dport 51820 -j ACCEPT", "Open Firewall Port 51820/UDP")
run("sudo iptables -I INPUT -p tcp --dport 51820 -j ACCEPT", "Open Firewall Port 51820/TCP")
run("sudo netfilter-persistent save 2>/dev/null || sudo iptables-save | sudo tee /etc/iptables/rules.v4 2>/dev/null || true", "Save Firewall Rules")

# Step 5: Start WireGuard
run("sudo systemctl start wg-quick@wg0", "Start WireGuard Service")
run("sudo systemctl status wg-quick@wg0 --no-pager", "WireGuard Service Status")
run("sudo wg show", "WireGuard Interface Status")

# Step 6: Print client config
server_ip = "80.225.208.24"
client_config = f"""[Interface]
PrivateKey = {client_priv}
Address = 10.0.0.2/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = {server_pub}
Endpoint = {server_ip}:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
"""

print("\n" + "=" * 60)
print("YOUR WIREGUARD CLIENT CONFIG:")
print("=" * 60)
print(client_config)
print("=" * 60)

client.close()
