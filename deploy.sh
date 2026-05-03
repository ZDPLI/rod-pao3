#!/bin/bash
# ============================================
# Deploy script for Ubuntu VPS (SQLite version)
# ГБУЗ "РОД" ПАО — Патологоанатомические услуги
# ============================================

set -e

PROJECT_NAME="rod-pao"
DOMAIN="${1:-}"

echo "========================================"
echo "  Deploying $PROJECT_NAME"
echo "========================================"

# 1. Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "[1/5] Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to logout and login again."
fi

# 2. Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "[2/5] Installing Docker Compose..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq docker-compose-plugin
fi

# 3. Build and start
echo "[3/5] Building and starting containers..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true
docker compose up --build -d 2>/dev/null || docker-compose up --build -d

# 4. Wait for app
echo "[4/5] Waiting for app to be ready..."
sleep 10

# 5. Push schema and seed
echo "[5/5] Initializing database..."
docker compose exec -T app npx drizzle-kit push --force 2>/dev/null || docker-compose exec -T app npx drizzle-kit push --force 2>/dev/null || true
docker compose exec -T app npx tsx db/seed.ts 2>/dev/null || docker-compose exec -T app npx tsx db/seed.ts 2>/dev/null || true

# Done
echo ""
echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo ""
if [ -n "$DOMAIN" ]; then
    echo "  Website: http://$DOMAIN:3000"
else
    echo "  Website: http://YOUR_VPS_IP:3000"
fi
echo "  Admin:   /login"
echo "  Health:  /api/health"
echo ""
echo "  Useful commands:"
echo "    docker compose logs -f app    # View app logs"
echo "    docker compose restart        # Restart everything"
echo "    docker compose down           # Stop everything"
echo ""
