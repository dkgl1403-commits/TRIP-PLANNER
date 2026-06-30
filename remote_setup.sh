#!/bin/bash
set -e

echo "Updating system..."
sudo apt-get update -y

echo "Installing Nginx, Python venv, and Node.js..."
sudo apt-get install -y nginx python3-venv python3-pip unzip curl

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Unzip project files
echo "Extracting project files..."
mkdir -p ~/TRIP_Planner
unzip -o ~/deploy.zip -d ~/TRIP_Planner

echo "Extracting Oracle Wallet..."
mkdir -p ~/wallet
unzip -o ~/Wallet_DKGLORACLEDB1.zip -d ~/wallet

echo "Setup backend virtual environment..."
cd ~/TRIP_Planner/backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn oracledb python-dotenv pydantic

echo "Dependencies installed successfully!"
