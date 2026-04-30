#!/bin/bash
# =============================================================
#  QTrack Deploy Script
#  Run this from your LOCAL machine (project root) to build
#  and upload everything to your EC2 instance.
#
#  Usage: chmod +x deploy/deploy.sh
#         ./deploy/deploy.sh <EC2_PUBLIC_IP> [key.pem]
#
#  Example: ./deploy/deploy.sh 13.235.50.100 ~/qtrack-key.pem
# =============================================================

set -e

EC2_IP=$1
KEY_FILE=$2
EC2_USER="ubuntu"

if [ -z "$EC2_IP" ]; then
  echo "Usage: ./deploy/deploy.sh <EC2_PUBLIC_IP> [path/to/key.pem]"
  exit 1
fi

SSH_OPTS=""
SCP_OPTS=""
if [ -n "$KEY_FILE" ]; then
  SSH_OPTS="-i $KEY_FILE"
  SCP_OPTS="-i $KEY_FILE"
fi

echo "========================================="
echo "  Building QTrack for production"
echo "========================================="

# 1. Build backend JAR
echo "[1/4] Building Spring Boot backend..."
cd backend
./mvnw clean package -DskipTests -q
cd ..
echo "    ✓ Backend JAR built."

# 2. Build frontend
echo "[2/4] Building React frontend..."
cd frontend
npm run build --silent
cd ..
echo "    ✓ Frontend built."

# 3. Upload to EC2
echo "[3/4] Uploading to EC2 ($EC2_IP)..."

echo "    Uploading backend JAR..."
scp $SCP_OPTS backend/target/collegeclub-0.0.1-SNAPSHOT.jar $EC2_USER@$EC2_IP:/home/ubuntu/qtrack/app.jar

echo "    Uploading frontend build..."
ssh $SSH_OPTS $EC2_USER@$EC2_IP "sudo rm -rf /var/www/qtrack/frontend/*"
scp $SCP_OPTS -r frontend/build/* $EC2_USER@$EC2_IP:/tmp/qtrack-frontend/
ssh $SSH_OPTS $EC2_USER@$EC2_IP "sudo cp -r /tmp/qtrack-frontend/* /var/www/qtrack/frontend/ && rm -rf /tmp/qtrack-frontend"

echo "    Uploading config files..."
scp $SCP_OPTS deploy/nginx-qtrack.conf $EC2_USER@$EC2_IP:/tmp/nginx-qtrack.conf
scp $SCP_OPTS deploy/qtrack.service $EC2_USER@$EC2_IP:/tmp/qtrack.service

# 4. Restart services on EC2
echo "[4/4] Restarting services on EC2..."
ssh $SSH_OPTS $EC2_USER@$EC2_IP << 'REMOTE'
  sudo cp /tmp/nginx-qtrack.conf /etc/nginx/sites-available/qtrack
  sudo ln -sf /etc/nginx/sites-available/qtrack /etc/nginx/sites-enabled/qtrack
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl restart nginx

  sudo cp /tmp/qtrack.service /etc/systemd/system/qtrack.service
  sudo systemctl daemon-reload
  sudo systemctl restart qtrack

  echo "    Waiting for backend to start..."
  sleep 5
  sudo systemctl status qtrack --no-pager -l | head -15
REMOTE

echo ""
echo "========================================="
echo "  ✓ Deployed to $EC2_IP"
echo "========================================="
echo "  Frontend: http://$EC2_IP"
echo "  API:      http://$EC2_IP/api/"
echo ""
