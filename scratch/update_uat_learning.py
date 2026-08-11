import paramiko

key = paramiko.RSAKey.from_private_key_file(r"C:\Users\dkgl1\.ssh\server_key.pem")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(hostname="80.225.208.24", username="ubuntu", pkey=key, timeout=20)
    print("=== Connected to UAT Server ===")
    
    cmd = """
    cd /home/ubuntu/TRIP_Planner_UAT
    git fetch origin uat
    git reset --hard origin/uat
    
    echo "=== Building Frontend ==="
    cd frontend
    npm install
    npm run build
    
    echo "=== Seeding Learning DB ==="
    cd ../backend
    source ../.env
    export PYTHONPATH=.
    python3 learning/seed.py
    
    echo "=== Restarting Backend ==="
    sudo pkill -f 'uvicorn main:app --host 0.0.0.0 --port 8001' || true
    nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 > /tmp/uvicorn_uat.log 2>&1 < /dev/null &
    echo "Update complete."
    """
    
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode('utf-8', errors='replace'))
    err = stderr.read().decode('utf-8', errors='replace')
    if err:
        print("ERRORS:")
        print(err)

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
