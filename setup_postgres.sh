#!/bin/bash
# setup_postgres.sh
# Run this on your server (ubuntu@80.225.208.24) to install and configure PostgreSQL

echo "Installing PostgreSQL..."
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Define database credentials
DB_NAME="finance_db"
DB_USER="finance_admin"
# Generate a random password for security
DB_PASS=$(openssl rand -base64 12)

echo "Creating Database and User..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# To allow the backend to create tables in the public schema of PostgreSQL 15+
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"

echo "Configuring PostgreSQL for remote access..."
# Find the postgresql.conf and pg_hba.conf files
PG_CONF_DIR=$(sudo -u postgres psql -c "SHOW config_file;" | grep -o '/.*/postgresql.conf' | sed 's/\/postgresql.conf//')

# Set listen_addresses to '*'
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "$PG_CONF_DIR/postgresql.conf"

# Allow all IP addresses to connect via password
echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a "$PG_CONF_DIR/pg_hba.conf"

echo "Restarting PostgreSQL..."
sudo systemctl restart postgresql

# Open firewall port 5432
sudo ufw allow 5432/tcp

echo "====================================================="
echo "PostgreSQL has been successfully installed and configured!"
echo "Database Name: $DB_NAME"
echo "Username:      $DB_USER"
echo "Password:      $DB_PASS"
echo ""
echo "Connection URL for backend/.env:"
echo "FINANCE_DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME\""
echo "====================================================="
