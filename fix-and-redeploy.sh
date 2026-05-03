#!/bin/bash
# Fix and redeploy script (native Node.js version)
set -e

cd ~/rod-pao
SERVICE_NAME="rod-pao"

echo "=== Stopping service ==="
sudo systemctl stop "$SERVICE_NAME"

echo "=== Installing dependencies ==="
npm ci

echo "=== Building frontend ==="
npm run build

echo "=== Starting service ==="
sudo systemctl start "$SERVICE_NAME"

echo "=== Waiting 10 seconds ==="
sleep 10

echo ""
echo "=== Checking health ==="
curl -s http://localhost:3000/api/health && echo "" || echo "API not ready yet"

echo ""
echo "Done! Try opening http://YOUR_VPS_IP:3000"
