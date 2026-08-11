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

# Step 1: Clean up failed Outline containers
run("sudo docker rm -f shadowbox watchtower 2>/dev/null || true", "Cleanup Failed Outline Containers")
run("sudo rm -rf /opt/outline 2>/dev/null || true", "Cleanup Outline Config")

# Step 2: Install WireGuard natively (works on ARM64!)
run("sudo apt-get update -y && sudo apt-get install -y wireguard qrencode", "Install WireGuard & QRencode")

# Step 3: Enable IP forwarding
run("echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-wireguard.conf && sudo sysctl -p /etc/sysctl.d/99-wireguard.conf", "Enable IP Forwarding")

# Step 4: Generate server keys
run("wg genkey | sudo tee /etc/wireguard/server_private.key | wg pubkey | sudo tee /etc/wireguard/server_public.key", "Generate Server Keys")
run("sudo chmod 600 /etc/wireguard/server_private.key", "Secure Server Private Key")

# Read server keys
server_priv = run("sudo cat /etc/wireguard/server_private.key").strip()
server_pub = run("sudo cat /etc/wireguard/server_public.key").strip()

# Step 5: Generate client keys (for your laptop/phone)
run("wg genkey | sudo tee /etc/wireguard/client_private.key | wg pubkey | sudo tee /etc/wireguard/client_public.key", "Generate Client Keys")
run("sudo chmod 600 /etc/wireguard/client_private.key", "Secure Client Private Key")

client_priv = run("sudo cat /etc/wireguard/client_private.key").strip()
client_pub = run("sudo cat /etc/wireguard/client_public.key").strip()

# Step 6: Detect the main network interface
iface = run("ip route | grep default | awk '{print $5}'").strip()
print(f"\nDetected network interface: {iface}")

# Step 7: Write WireGuard server config
server_config = f"""[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = {server_priv}
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o {iface} -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o {iface} -j MASQUERADE

[Peer]
PublicKey = {client_pub}
AllowedIPs = 10.0.0.2/32
"""
write_cmd = f'echo "{server_config}" | sudo tee /etc/wireguard/wg0.conf'
run(write_cmd, "Write Server Config (wg0.conf)")
run("sudo chmod 600 /etc/wireguard/wg0.conf", "Secure Config")

# Step 8: Start WireGuard
run("sudo systemctl enable wg-quick@wg0 && sudo systemctl start wg-quick@wg0", "Start WireGuard Service")
run("sudo wg show", "WireGuard Status")

# Step 9: Generate client config
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
print("YOUR WIREGUARD CLIENT CONFIG (copy this):")
print("=" * 60)
print(client_config)
print("=" * 60)

# Save client config on server for QR code generation
save_cmd = f'echo "{client_config}" | sudo tee /etc/wireguard/client.conf'
run(save_cmd, "Save Client Config")

# Generate QR code (for phone scanning)
run("sudo cat /etc/wireguard/client.conf | qrencode -t ansiutf8", "QR Code for Mobile")

client.close()
