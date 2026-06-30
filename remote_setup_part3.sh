#!/bin/bash
set -e

echo "Upgrading Node.js to 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build Frontend
echo "Building frontend..."
cd ~/TRIP_Planner/frontend
npm install
npm run build

# Setup Nginx
echo "Setting up Nginx configuration..."
sudo cat << 'EOF' > /tmp/trip_planner.conf
server {
    listen 80;
    server_name _;

    root /home/ubuntu/TRIP_Planner/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo mv /tmp/trip_planner.conf /etc/nginx/sites-available/trip_planner
sudo ln -sf /etc/nginx/sites-available/trip_planner /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Fix permissions so Nginx can access the frontend files
sudo usermod -aG ubuntu www-data
sudo chmod 755 /home/ubuntu
sudo chmod -R 755 /home/ubuntu/TRIP_Planner/frontend/dist

# Restart Nginx
sudo systemctl restart nginx

# Open firewall port 80 and 8000 (just in case)
sudo ufw allow 80/tcp
sudo ufw allow 8000/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

echo "Setup Part 3 Complete!"
