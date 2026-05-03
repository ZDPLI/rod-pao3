#!/bin/bash
# ============================================
# Чистая установка приложения ГБУЗ "РОД" ПАО
# VPS / Ubuntu / Debian — БЕЗ Docker, только SQLite
# ============================================

set -e

PROJECT_NAME="rod-pao"
INSTALL_DIR="${1:-$HOME/rod-pao}"
GIT_REPO="${2:-}"
DOMAIN="${3:-}"
SERVICE_NAME="rod-pao"
NODE_VERSION="20"

echo "========================================"
echo "  INSTALL: $PROJECT_NAME"
echo "  Dir: $INSTALL_DIR"
echo "  Mode: Native (no Docker, SQLite only)"
echo "========================================"

# 1. Fix apt first (ignore broken packages from previous installs)
echo "[1/11] Fixing apt state..."
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -qq || true
sudo dpkg --configure -a 2>/dev/null || true
sudo apt-get -f install -y -qq 2>/dev/null || true

# 2. Install system dependencies (NO mysql, NO nginx yet)
echo "[2/11] Installing build dependencies..."
sudo apt-get install -y -qq --no-install-recommends \
    curl git build-essential python3 ca-certificates

# 3. Install Node.js
echo "[3/11] Installing Node.js $NODE_VERSION..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "$NODE_VERSION" ]; then
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | sudo -E bash -
    sudo apt-get install -y -qq --no-install-recommends nodejs
fi
echo "  Node.js: $(node --version)"
echo "  npm:     $(npm --version)"

# 4. Prepare directory
echo "[4/11] Preparing directory..."
if [ -d "$INSTALL_DIR" ]; then
    echo "  Directory exists. Cleaning old build..."
    rm -rf "$INSTALL_DIR"
fi
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# 5. Get code
echo "[5/11] Getting application code..."
if [ -n "$GIT_REPO" ]; then
    git clone "$GIT_REPO" .
else
    echo "  WARNING: No GIT_REPO provided."
    echo "  Place application files into: $INSTALL_DIR"
    if [ ! -f "package.json" ]; then
        echo "  ERROR: No package.json found. Please copy files first."
        exit 1
    fi
fi

# 6. Install dependencies
echo "[6/11] Installing npm dependencies..."
npm ci

# 7. Build frontend
echo "[7/11] Building frontend..."
npm run build

# 8. Initialize database
echo "[8/11] Initializing SQLite database..."
mkdir -p data
export DATABASE_URL="./data/rod.db"
npx drizzle-kit push --force
npx tsx db/seed.ts

echo "  Database file: $(ls -lh data/rod.db)"

# 9. Create systemd service
echo "[9/11] Creating systemd service..."
sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" > /dev/null << EOF
[Unit]
Description=ГБУЗ РОД ПАО — Патологоанатомические услуги
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$INSTALL_DIR
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL=./data/rod.db
ExecStart=$(which npx) tsx api/boot.ts
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"

# 10. Start service
echo "[10/11] Starting application..."
sudo systemctl start "$SERVICE_NAME"

# Wait for startup
echo "  Waiting for app to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "  App is ready!"
        break
    fi
    echo "  Waiting... ($i/30)"
    sleep 2
done

# 11. Health check
echo "[11/11] Final health check..."
HEALTH=$(curl -s http://localhost:3000/api/health || echo "FAIL")
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || echo "000")

echo ""
echo "========================================"
echo "  INSTALLATION COMPLETE"
echo "========================================"
echo ""
if [ -n "$DOMAIN" ]; then
    echo "  Website:  http://$DOMAIN"
else
    echo "  Website:  http://YOUR_VPS_IP:3000"
fi
echo "  Health:   /api/health"
echo "  Admin:    /login"
echo "  Response: $HEALTH"
echo "  HTTP:     $HTTP_CODE"
echo ""
echo "  Service commands:"
echo "    sudo systemctl status $SERVICE_NAME"
echo "    sudo systemctl restart $SERVICE_NAME"
echo "    sudo systemctl stop $SERVICE_NAME"
echo "    sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "  NOTE: Nginx was NOT installed automatically."
echo "  Run the following if you need a reverse proxy:"
echo "    sudo apt-get install -y nginx"
echo ""
