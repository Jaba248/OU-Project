# Freelancer Project Management Platform — Installation & Runbook

This application has two run paths:

- **A. Docker (recommended for marker)** — one command brings up Postgres, Django (Gunicorn), and Nginx serving the React build and proxying `/graphql`.
- **B. Host install** — for a classic Linux/macOS host with Postgres, Gunicorn, and Nginx. (On Windows, path A is recommended.)

> Dev note: local development uses **SQLite** + `vite dev`. Production builds use **Postgres** as proposed.

---

## 0) Prerequisites

### Option A: Docker

- Docker 24+ and Docker Compose v2

### Option B: Host install

- macOS / Linux
- Python 3.12+, Node 20+
- Postgres 16+
- Nginx 1.24+
- (optional) Certbot if adding TLS (for https)

---

## 1) Environment variables

Create a `.env` **in the repo root** (copy from `.env.example`):

```
# Toggles Debug State
IS_PRODUCTION=false

# Rest are database values
```

---

## 2A) Quick start (Docker) — **recommended**

From the repo root:

```bash
docker compose up -d --build
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
```

Open **http://localhost**

- React build is served by Nginx.
- `/graphql` is proxied to Django (Gunicorn).

**Basic Functionality checks**

1. Visit `/` → the app loads.
2. Register/login → dashboard visible.
3. Create Client/Project/Task → items appear in lists.
4. Create Invoice (test) on a project → a Stripe **test** URL appears on the Project detail & The url is auto opened to view the payment page/invoice.

Logs: `docker compose logs -f`  
Stop: `docker compose down`

---

## 2B) Host install on unix/linux (Postgres + Gunicorn + Nginx)

### 2B.1) Database (Postgres)

```bash
sudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD 'apppass';"
sudo -u postgres psql -c "CREATE DATABASE app OWNER appuser;"
```

### 2B.2) Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ..
export $(grep -v '^#' .env | xargs)  # loads env for this shell

cd backend
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser

# test locally (temporary)
gunicorn project.wsgi:application -b 127.0.0.1:8000
```

### 2B.3) Frontend (React)

```bash
cd ../frontend
npm ci
npm run build
```

### 2B.4) Nginx

Copy `deploy/nginx.conf` to `/etc/nginx/conf.d/default.conf`, and ensure the paths match:

- frontend build → `.../frontend/dist`
- static files → `.../backend/static`

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Open **http://localhost** and repeat the smoke checks.

---

## 3) Directory expectations

```
OU-Project/
├── backend/
│   ├── manage.py
│   ├── project/           # Django project (settings.py here)
│   ├── static/       # created by collectstatic
├── frontend/
│   └── dist/              # created by `npm run build`
└── deploy/
    └── nginx.conf
```

---

## 4) Development Environment (SQLite + Vite)

```bash
# Backend (SQLite)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (Vite)
cd ../frontend
npm ci
npm run dev
```

---

## 5) Notes & Security

- **Prod uses Postgres** (as per proposal & tutor guidance). **SQLite** is used for dev only — explained in the EMA Document.
- **Stripe is TEST MODE ONLY** — using a test key from a sanbox i created specifically for this project.
- GraphiQL is only active when IS\_\_production enviroment variable is not set, or is set to false
