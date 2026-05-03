# VPS Установка — ГБУЗ "РОД" ПАО

Полная инструкция для развёртывания на любом VPS (Ubuntu/Debian) **без Docker**, только **SQLite**.

**MySQL не используется и не устанавливается.**

---

## ⚡ Быстрая установка (копируйте блоки по очереди)

### 1. Подключитесь к VPS по SSH

```bash
ssh root@YOUR_VPS_IP
```

### 2. Если apt сломан (mysql или другие пакеты) — почините

```bash
export DEBIAN_FRONTEND=noninteractive
sudo dpkg --configure -a
sudo apt-get -f install -y
sudo apt-get update
```

Если `mysql-server` мешает и он не нужен:
```bash
sudo apt-get remove --purge -y mysql-server mysql-server-8.0
sudo apt-get autoremove -y
sudo apt-get -f install -y
```

### 3. Установите Node.js 20 и build tools

```bash
sudo apt-get install -y --no-install-recommends curl git build-essential python3 ca-certificates

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y --no-install-recommends nodejs

node --version   # v20.x.x
npm --version    # 10.x.x
```

### 4. Создайте пользователя (опционально, но рекомендуется)

```bash
adduser rod
usermod -aG sudo rod
su - rod
```

### 5. Загрузите файлы приложения

```bash
mkdir -p ~/rod-pao && cd ~/rod-pao
```

**Вариант А — через Git:**
```bash
git clone https://github.com/ВАШ_НИК/rod-pao.git .
```

**Вариант Б — через SCP (с вашего компьютера):**
```bash
# Выполните на локальной машине:
scp -r ./app/* root@YOUR_VPS_IP:/home/rod/rod-pao/
```

**Вариант В — архив:**
```bash
apt-get install -y unzip
unzip rod-pao.zip -d ~/rod-pao/
cd ~/rod-pao
```

### 6. Сделайте скрипты исполняемыми и запустите установку

```bash
chmod +x scripts/*.sh *.sh
./scripts/install.sh
```

Или вручную по шагам:

```bash
cd ~/rod-pao

# Установка зависимостей
npm ci

# Сборка фронтенда
npm run build

# Инициализация SQLite БД
mkdir -p data
export DATABASE_URL=./data/rod.db
npx drizzle-kit push --force
npx tsx db/seed.ts

# Создание systemd сервиса
sudo tee /etc/systemd/system/rod-pao.service > /dev/null << 'EOF'
[Unit]
Description=ГБУЗ РОД ПАО — Патологоанатомические услуги
After=network.target

[Service]
Type=simple
User=rod
WorkingDirectory=/home/rod/rod-pao
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL=./data/rod.db
ExecStart=/usr/bin/npx tsx api/boot.ts
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable rod-pao
sudo systemctl start rod-pao
```

### 7. Проверьте работоспособность

```bash
curl http://localhost:3000/api/health
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/
```

Ожидаемый результат:
```json
{"status":"ok","timestamp":"2026-..."}
HTTP 200
```

### 8. Откройте в браузере

```
http://YOUR_VPS_IP:3000
```

Админ-панель: `http://YOUR_VPS_IP:3000/login`

---

## 🗑 Полный снос

```bash
cd ~/rod-pao
./scripts/uninstall.sh
```

Это удалит:
- Systemd сервис `rod-pao`
- Директорию `~/rod-pao`
- Файл базы данных `~/rod-pao/data/rod.db`

Node.js **не удаляется**.

---

## 🔄 Обновление (без потери БД)

```bash
cd ~/rod-pao
./scripts/update.sh
```

Данные SQLite сохраняются в `~/rod-pao/data/rod.db`.

---

## 🛠 Полезные команды

| Команда | Описание |
|---------|----------|
| `sudo systemctl status rod-pao` | Статус сервиса |
| `sudo systemctl restart rod-pao` | Перезапуск приложения |
| `sudo systemctl stop rod-pao` | Остановка |
| `sudo journalctl -u rod-pao -f` | Логи в реальном времени |
| `sudo journalctl -u rod-pao -n 100 --no-pager` | Последние 100 строк логов |
| `curl http://localhost:3000/api/health` | Проверка API |

---

## 🔐 Настройка Nginx + HTTPS (опционально)

Если нужен домен и SSL, установите Nginx **отдельно** после того как приложение уже работает:

```bash
sudo apt-get install -y nginx
```

### Конфиг Nginx

```bash
sudo tee /etc/nginx/sites-available/rod-pao > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/trpc {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/rod-pao /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL через Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com --non-interactive --agree-tos -m your@email.com
```

### Открыть порты

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp   # временно, для прямого доступа
sudo ufw enable
```

### Закрыть прямой доступ к порту 3000 (опционально)

Если Nginx работает, можно закрыть порт 3000 для внешнего мира:

```bash
sudo ufw delete allow 3000/tcp
```

---

## 📁 Резервное копирование

### База данных

```bash
# Просто скопируйте файл БД
cp ~/rod-pao/data/rod.db ~/backup-rod-$(date +%Y%m%d).db
```

### Весь проект

```bash
tar -czf rod-pao-backup-$(date +%Y%m%d).tar.gz ~/rod-pao
```

---

## 🐛 Диагностика проблем

### Приложение не отвечает

```bash
# Статус сервиса
sudo systemctl status rod-pao --no-pager -l

# Логи
sudo journalctl -u rod-pao -n 50 --no-pager

# Проверка процесса
ps aux | grep tsx

# Проверка порта
ss -tlnp | grep 3000

# Health endpoint
curl -v http://localhost:3000/api/health
```

### Ошибки сборки (better-sqlite3)

Если `npm ci` падает на сборке `better-sqlite3`:

```bash
# Убедитесь что build tools установлены
sudo apt-get install -y build-essential python3 make

# Пересборка нативных модулей
npm rebuild
```

### Ошибки прав доступа к БД

```bash
# Убедитесь что пользователь имеет права на директорию data
chmod 755 ~/rod-pao/data
chmod 644 ~/rod-pao/data/rod.db
```

### Полная переустановка без потери данных

```bash
cd ~/rod-pao

# Сохранить БД
cp data/rod.db /tmp/rod-backup.db

# Переустановить зависимости и собрать
rm -rf node_modules dist
npm ci
npm run build

# Восстановить БД (если нужно)
mkdir -p data
cp /tmp/rod-backup.db data/rod.db

# Перезапуск
sudo systemctl restart rod-pao
```

---

## 📋 Переменные окружения

Настройки через systemd unit файл `/etc/systemd/system/rod-pao.service`:

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `NODE_ENV` | `production` | Режим работы |
| `PORT` | `3000` | Порт приложения |
| `DATABASE_URL` | `./data/rod.db` | Путь к SQLite БД |

После изменения переменных:

```bash
sudo systemctl daemon-reload
sudo systemctl restart rod-pao
```

---

## 🔥 Ручной перезапуск (если скрипты недоступны)

```bash
cd ~/rod-pao
npm run build
sudo systemctl restart rod-pao
sleep 5
curl http://localhost:3000/api/health
```

---

**Готово к работе!**
