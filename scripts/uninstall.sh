#!/bin/bash
# ============================================
# Полный снос приложения ГБУЗ "РОД" ПАО
# БЕЗ Docker — чистая системная установка
# ============================================

set -e

PROJECT_NAME="rod-pao"
INSTALL_DIR="${1:-$HOME/rod-pao}"
SERVICE_NAME="rod-pao"
DATA_DIR="${2:-$INSTALL_DIR/data}"

echo "========================================"
echo "  UNINSTALL: $PROJECT_NAME"
echo "  Install dir: $INSTALL_DIR"
echo "  Data dir:    $DATA_DIR"
echo "========================================"

# 1. Остановка сервиса
echo "[1/6] Stopping systemd service..."
sudo systemctl stop "$SERVICE_NAME" 2>/dev/null || true
sudo systemctl disable "$SERVICE_NAME" 2>/dev/null || true

# 2. Удаление systemd unit
echo "[2/6] Removing systemd unit..."
sudo rm -f "/etc/systemd/system/${SERVICE_NAME}.service"
sudo systemctl daemon-reload

# 3. Удаление данных БД
echo "[3/6] Removing database..."
if [ -d "$DATA_DIR" ]; then
    rm -rf "$DATA_DIR"
    echo "  Removed: $DATA_DIR"
fi
if [ -f "$INSTALL_DIR/rod.db" ]; then
    rm -f "$INSTALL_DIR/rod.db"
    echo "  Removed: $INSTALL_DIR/rod.db"
fi

# 4. Удаление Nginx конфига (если был)
echo "[4/6] Removing Nginx config..."
sudo rm -f "/etc/nginx/sites-enabled/${SERVICE_NAME}" 2>/dev/null || true
sudo rm -f "/etc/nginx/sites-available/${SERVICE_NAME}" 2>/dev/null || true
sudo systemctl reload nginx 2>/dev/null || true

# 5. Удаление директории проекта
echo "[5/6] Removing project directory..."
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    echo "  Removed: $INSTALL_DIR"
else
    echo "  Directory not found: $INSTALL_DIR"
fi

# 6. Проверка
echo "[6/6] Verification..."
echo "  Service status:"
sudo systemctl status "$SERVICE_NAME" 2>/dev/null || echo "  (service not found — OK)"

echo ""
echo "========================================"
echo "  UNINSTALL COMPLETE"
echo "========================================"
echo ""
echo "Systemd service, project files, and"
echo "database have been removed."
echo ""
echo "Node.js and Nginx were NOT removed."
echo ""
