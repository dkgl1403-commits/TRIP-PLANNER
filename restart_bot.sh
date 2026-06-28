#!/bin/bash
set -e

echo "Setting up 2GB swapfile to prevent Out of Memory crashes..."
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

echo "Installing prerequisites..."
sudo dnf clean all
sudo dnf install -y screen unzip

echo "Installing Terraform..."
wget -qO /tmp/tf.zip https://releases.hashicorp.com/terraform/1.9.0/terraform_1.9.0_linux_amd64.zip
sudo unzip -o /tmp/tf.zip -d /usr/local/bin/

echo "Starting Ampere Auto-Provisioning Bot in a detached screen session..."
cd ~/ampere-bot
chmod +x deploy.sh
terraform init
screen -dmS ampere-bot ./deploy.sh

echo "Waiting 5 seconds for bot to initialize..."
sleep 5
screen -S ampere-bot -X hardcopy /tmp/bot-log.txt
cat /tmp/bot-log.txt
