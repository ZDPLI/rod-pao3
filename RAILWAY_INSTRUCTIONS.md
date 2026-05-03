# ДЕПЛОЙ — ИНСТРУКЦИЯ

Приложение использует **SQLite** (`better-sqlite3`). Никакой MySQL не требуется.

---

## ОПЦИЯ 1: Render.com — 5 минут

### Шаг 1: Загрузить код на GitHub
```bash
cd /mnt/agents/output/app
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/ВАШ_НИК/rod-pao.git
git push -u origin main
```

### Шаг 2: Создать аккаунт на Render
1. Откройте https://render.com
2. Нажмите **Sign Up** → **Sign Up with GitHub**

### Шаг 3: Создать Web Service
1. На Dashboard нажмите **New** → **Web Service**
2. Выберите ваш GitHub репозиторий `rod-pao`
3. Настройки:
   - **Name**: `rod-pao`
   - **Runtime**: `Docker`
   - **Plan**: `Free`
   - Остальное оставьте по умолчанию
4. Нажмите **Create Web Service**

### Шаг 4: Добавить Disk (для SQLite)
1. В сервисе перейдите во вкладку **Disks**
2. Нажмите **Add Disk**
3. Укажите:
   - **Name**: `rod-data`
   - **Mount Path**: `/app/data`
   - **Size**: `1 GB`
4. Нажмите **Save**

### Шаг 5: Переменные окружения
1. Перейдите во вкладку **Environment**
2. Добавьте:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | `./data/rod.db` |

3. Нажмите **Save Changes**
4. Render автоматически пересоберёт

### Шаг 6: Инициализация базы данных
1. В Render перейдите во вкладку **Shell** (иконка `>_`)
2. Выполните:
```bash
npx drizzle-kit push --force
```
(нажмите `y` на подтверждение)

3. Затем:
```bash
npx tsx db/seed.ts
```

### Шаг 7: Готово!
Ваш сайт доступен по URL из Render Dashboard.

**Вход в админку:** `/login` → пароль: `rod-admin`

---

## ОПЦИЯ 2: VPS / Собственный сервер — 10 минут

### Любой VPS с Docker (Hetzner, DigitalOcean, AWS):
```bash
# 1. Установить Docker
curl -fsSL https://get.docker.com | sh

# 2. Клонировать репозиторий
git clone https://github.com/ВАШ_НИК/rod-pao.git
cd rod-pao

# 3. Запустить
docker compose up --build -d

# 4. Инициализировать базу данных
docker compose exec app npx drizzle-kit push --force
docker compose exec app npx tsx db/seed.ts
```

---

## Диагностика: Как проверить что работает

| Проверка | Команда / URL |
|---|---|
| Health endpoint | `curl https://ВАШ-ДОМЕН.com/api/health` |
| Список категорий | `curl https://ВАШ-ДОМЕН.com/api/trpc/category.list` |
| Сайт | `https://ВАШ-ДОМЕН.com/` |
| Админка | `https://ВАШ-ДОМЕН.com/login` |

---

## Вход в админ-панель

На ВСЕХ хостингах вход одинаковый:
1. Откройте `/login`
2. Введите пароль: **`rod-admin`**
3. Нажмите **Войти как администратор**

OAuth-переменные (APP_ID, APP_SECRET) **НЕ НУЖНЫ**.

---

## Обновление сайта

После изменений в коде:
```bash
git add .
git commit -m "Update"
git push origin main
```

Хостинг автоматически пересоберёт (3-5 минут).
