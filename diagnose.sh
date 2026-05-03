#!/bin/bash
# ============================================
# Quick diagnostic script for native deployment
# ============================================

set -e

SERVICE_NAME="rod-pao"

echo "Checking service status..."
sudo systemctl status "$SERVICE_NAME" --no-pager -l || true

echo ""
echo "Checking dist/public exists..."
ls -la ~/rod-pao/dist/public/ 2>/dev/null || echo "dist/public NOT FOUND"

echo ""
echo "Checking if index.html exists..."
ls -la ~/rod-pao/dist/public/index.html 2>/dev/null || echo "index.html NOT FOUND"

echo ""
echo "Checking API health..."
curl -s http://localhost:3000/api/health || echo "API not responding"

echo ""
echo "Checking root page..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ || echo "Root not accessible"

echo ""
echo "Checking database file..."
ls -la ~/rod-pao/data/rod.db 2>/dev/null || echo "Database file NOT FOUND"

echo ""
echo "Recent logs:"
sudo journalctl -u "$SERVICE_NAME" --no-pager -n 20 || true

echo ""
echo "Done!"
