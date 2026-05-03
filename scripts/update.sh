#!/bin/bash
# ============================================
# Обновление приложения ГБУЗ "РОД" ПАО
# БЕЗ Docker — данные БД сохраняются
# ============================================

set -e

INSTALL_DIR="${1:-$HOME/rod-pao}"
SERVICE_NAME="rod-pao"

echo "========================================"
echo "  UPDATE: rod-pao"
echo "  Dir: $INSTALL_DIR"
echo "========================================"

cd "$INSTALL_DIR"

# 1. Pull latest code
echo "[1/5] Pulling latest code..."
git pull origin main 2>/dev/null || echo "  (no git repo or no changes)"

# 2. Install dependencies
echo "[2/5] Installing dependencies..."
npm ci

# 3. Build frontend
echo "[3/5] Building frontend..."
npm run build

# 4. Restart service
echo "[4/5] Restarting service..."
sudo systemctl restart "$SERVICE_NAME"

# 5. Health check
echo "[5/5] Waiting for health check..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "  App is healthy!"
        break
    fi
    echo "  Waiting... ($i/30)"
    sleep 2
done

echo ""
echo "========================================"
echo "  UPDATE COMPLETE"
echo "========================================"
echo ""
curl -s http://localhost:3000/api/health && echo "" || echo "Health check failed"
echo ""
