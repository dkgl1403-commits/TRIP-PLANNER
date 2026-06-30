#!/bin/bash
set -e

echo "Updating apt..."
sudo apt-get update

echo "Installing certbot and nginx plugin..."
sudo apt-get install -y certbot python3-certbot-nginx

echo "Configuring Nginx server_name..."
# We need to change "server_name _;" to "server_name 80.225.208.24.nip.io;" in /etc/nginx/sites-available/default
sudo sed -i 's/server_name _;/server_name 80.225.208.24.nip.io;/g' /etc/nginx/sites-available/default

echo "Testing Nginx configuration..."
sudo nginx -t

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Running Certbot..."
sudo certbot --nginx -d 80.225.208.24.nip.io --non-interactive --agree-tos -m dummy@example.com --redirect

echo "Configuring iptables for HTTPS (Port 443)..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

echo "SSL Setup Complete!"
