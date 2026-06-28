#!/bin/bash
set -e

echo "Downloading Terraform..."
wget -qO /tmp/tf.zip https://releases.hashicorp.com/terraform/1.9.0/terraform_1.9.0_linux_amd64.zip

echo "Extracting Terraform using Python (bypassing unzip command)..."
python3 -c "import zipfile; zipfile.ZipFile('/tmp/tf.zip', 'r').extractall('/tmp/')"
sudo mv /tmp/terraform /usr/local/bin/
sudo chmod +x /usr/local/bin/terraform

echo "Initializing Terraform..."
cd ~/ampere-bot
chmod +x deploy.sh
terraform init

echo "Starting Ampere Bot in the background (nohup)..."
nohup ./deploy.sh > /tmp/bot-log.txt 2>&1 &

echo "Waiting 5 seconds for initialization..."
sleep 5
echo "--- LATEST LOG OUTPUT ---"
tail -n 15 /tmp/bot-log.txt
