import subprocess
import time
from datetime import datetime

# Configuration
INTERVAL_SECONDS = 60  # Wait time between attempts in seconds

def run_terraform():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Executing 'terraform apply -auto-approve'...")
    try:
        # Run terraform apply and pipe output to terminal
        result = subprocess.run(["terraform", "apply", "-auto-approve"], check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Terraform execution failed with exit code: {e.returncode}")
        return False

def main():
    print("Starting OCI Ampere Instance Provisioning Loop (Python)...")
    print(f"Will retry every {INTERVAL_SECONDS} seconds until successful.")
    print("-" * 50)
    
    attempt = 1
    while True:
        print(f"\n--- Attempt #{attempt} ---")
        success = run_terraform()
        if success:
            print("=" * 50)
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] SUCCESS: Instance created successfully on Attempt #{attempt}!")
            print("=" * 50)
            break
        else:
            print(f"Attempt #{attempt} failed. Retrying in {INTERVAL_SECONDS} seconds...")
            time.sleep(INTERVAL_SECONDS)
            attempt += 1

if __name__ == "__main__":
    main()
