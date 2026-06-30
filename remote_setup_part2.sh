#!/bin/bash
set -e

# Setup .env for Backend
echo "Setting up backend .env..."
cat << 'EOF' > ~/TRIP_Planner/backend/.env
DB_USER=ADMIN
DB_PASSWORD=Month@062026
DB_DSN=dkgloracledb1_low
DB_WALLET_DIR=/home/ubuntu/wallet
EOF

# Start backend via PM2
echo "Starting FastAPI backend with PM2..."
cd ~/TRIP_Planner/backend
pm2 start "venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000" --name "trip-planner-backend"

# Build Frontend
echo "Installing frontend dependencies and building..."
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

echo "Setup Part 2 Complete!"
