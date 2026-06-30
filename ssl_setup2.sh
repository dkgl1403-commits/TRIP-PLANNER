#!/bin/bash
set -e

echo "Removing old certbot..."
sudo apt-get remove -y certbot

echo "Installing certbot via snap..."
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

echo "Configuring Nginx server_name..."
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
