# Oracle Cloud Infrastructure Ampere Instance Provisioner (Free Tier Capacity Loop)

This project contains a Terraform configuration and a loop script to repeatedly attempt creating an OCI Ampere A1 Flex instance (`VM.Standard.A1.Flex` with 2 OCPUs and 12 GB RAM) until capacity becomes available.

## Prerequisites & Required Keys

To authenticate Terraform with OCI, you need to set up an API Key in your Oracle Cloud Console.

### 1. Generate OCI API Signing Key
On your local machine or your existing OCI instance, generate an RSA key pair:
```bash
# Create directory for OCI keys
mkdir -p ~/.oci

# Generate private key
openssl genrsa -out ~/.oci/oci_api_key.pem 2048

# Change permissions
chmod 600 ~/.oci/oci_api_key.pem

# Generate public key
openssl rsa -pubout -in ~/.oci/oci_api_key.pem -out ~/.oci/oci_api_key_public.pem
```

### 2. Upload Public Key to OCI Console
1. Log in to the **OCI Console**.
2. Click your Profile icon in the top right -> **User Settings**.
3. Under **Resources** on the bottom-left, click **API Keys**.
4. Click **Add API Key**.
5. Choose **Upload Public Key File** and upload `~/.oci/oci_api_key_public.pem` (or paste its content).
6. Copy the configuration details displayed (you will need the **User OCID**, **Tenancy OCID**, **Fingerprint**, and **Region**).

---

## Files Provided in This Repository

1. [main.tf](file:///c:/Personal/Projects/TRIP_Planner/main.tf): Core Terraform script defining the OCI provider and compute instance resources.
2. [variables.tf](file:///c:/Personal/Projects/TRIP_Planner/variables.tf): Variable definitions for your OCI credentials and instance configurations.
3. [terraform.tfvars.example](file:///c:/Personal/Projects/TRIP_Planner/terraform.tfvars.example): Template file. Copy this to `terraform.tfvars` and fill in your values.
4. [deploy.sh](file:///c:/Personal/Projects/TRIP_Planner/deploy.sh): Bash script to run Terraform in a loop (tries every 1 minute) until the instance is successfully created.

---

## Step-by-Step Guide to Deploying

### Step 1: Set Up Credentials
Copy the example variables file:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Open `terraform.tfvars` and fill in all the values:
- `tenancy_ocid`, `user_ocid`, `fingerprint`, and `region` from the API Key screen.
- `private_key_path`: Set this to the absolute path of your private key, e.g., `/home/opc/.oci/oci_api_key.pem` or `/home/ubuntu/.oci/oci_api_key.pem`.
- `compartment_ocid`: Found under Identity & Security -> Compartments (or use your root tenancy OCID).
- `subnet_ocid`: Go to Networking -> Virtual Cloud Networks -> Select your VCN -> Select your Subnet and copy its OCID.
- `ssh_public_key`: Put the contents of your public SSH key (e.g. `~/.ssh/id_rsa.pub`) that you will use to log into the new instance.

### Step 2: Initialize Terraform
Initialize the working directory to download the OCI provider:
```bash
terraform init
```

### Step 3: Run the Capacity Retry Script
Ensure the `deploy.sh` script is executable and run it:
```bash
chmod +x deploy.sh
./deploy.sh
```

Alternatively, you can run it in the background using `nohup` or `screen` so it keeps running even if you disconnect from your terminal session:
```bash
nohup ./deploy.sh > deploy.log 2>&1 &
```
You can monitor the progress with:
```bash
tail -f deploy.log
```
Once the instance is successfully created, the script will print a success message and terminate automatically.
