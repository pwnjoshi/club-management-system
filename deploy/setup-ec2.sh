#!/bin/bash
# =============================================================
#  QTrack EC2 Setup Script
#  Run this on a fresh Ubuntu 22.04/24.04 EC2 instance
#  Usage: chmod +x setup-ec2.sh && sudo ./setup-ec2.sh
# =============================================================

set -e

echo "========================================="
echo "  QTrack EC2 Server Setup"
echo "========================================="

# 1. System update
echo "[1/6] Updating system packages..."
apt update && apt upgrade -y

# 2. Install Java 17
echo "[2/6] Installing Java 17..."
apt install -y openjdk-17-jre-headless

# 3. Install MySQL
echo "[3/6] Installing MySQL..."
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql

# Create database and user
mysql -e "CREATE DATABASE IF NOT EXISTS collegeclubdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'clubapp'@'localhost' IDENTIFIED BY 'QTrack@2026Secure';"
mysql -e "GRANT ALL PRIVILEGES ON collegeclubdb.* TO 'clubapp'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"
echo "    ✓ MySQL database 'collegeclubdb' and user 'clubapp' created."

# 4. Install Nginx
echo "[4/6] Installing Nginx..."
apt install -y nginx
systemctl enable nginx

# 5. Create app directories
echo "[5/6] Creating app directories..."
mkdir -p /home/ubuntu/qtrack
mkdir -p /var/www/qtrack/frontend

# 6. Setup firewall
echo "[6/6] Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "========================================="
echo "  ✓ Server setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Upload app.jar to /home/ubuntu/qtrack/app.jar"
echo "  2. Upload frontend build to /var/www/qtrack/frontend/"
echo "  3. Copy nginx config:  cp nginx-qtrack.conf /etc/nginx/sites-available/qtrack"
echo "  4. Enable site:        ln -s /etc/nginx/sites-available/qtrack /etc/nginx/sites-enabled/"
echo "  5. Remove default:     rm /etc/nginx/sites-enabled/default"
echo "  6. Test nginx:         nginx -t && systemctl restart nginx"
echo "  7. Copy service file:  cp qtrack.service /etc/systemd/system/"
echo "  8. Start backend:      systemctl daemon-reload && systemctl enable qtrack && systemctl start qtrack"
echo "  9. Install SSL:        apt install certbot python3-certbot-nginx -y"
echo "                         certbot --nginx -d qtrack.in -d www.qtrack.in"
echo ""
