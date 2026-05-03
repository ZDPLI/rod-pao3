#!/bin/bash
# Quick fix and redeploy (native Node.js version)
set -e

cd ~/rod-pao
SERVICE_NAME="rod-pao"

echo "=== Pulling latest code ==="
git pull origin main 2>/dev/null || echo "Skipping git pull"

echo "=== Stopping service ==="
sudo systemctl stop "$SERVICE_NAME"

echo "=== Installing dependencies ==="
npm ci

echo "=== Building frontend ==="
npm run build

echo "=== Starting service ==="
sudo systemctl start "$SERVICE_NAME"

echo "=== Waiting 15 seconds ==="
sleep 15

echo ""
echo "=== Checking health ==="
curl -s http://localhost:3000/api/health && echo "" || echo "API not ready yet"

echo ""
echo "=== Checking root page ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/

echo ""
echo "Done! If you see HTTP 200 above, the site is live."
