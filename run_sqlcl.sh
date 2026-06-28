#!/bin/bash
wget -qO sqlcl-latest.zip https://download.oracle.com/otn_software/java/sqldeveloper/sqlcl-latest.zip
unzip -qo sqlcl-latest.zip
sudo dnf install -y java-11-openjdk-headless

export TNS_ADMIN=/home/opc/Wallet_DKGLORACLEDB1

cat << 'EOF' > insert.sql
INSERT INTO users (password_hash, role, name, gender, phone, email, address)
VALUES ('test_hash_password_123', 'ADMIN', 'John Doe', 'Male', '+1234567890', 'john.doe@tripplanner.com', '123 Cloud Way, Oracle City');
COMMIT;
EOF

./sqlcl/bin/sql -S admin/"Month@062026"@dkgloracledb1_low @insert.sql
