# Installation & Deployment Test Log

> Project: Freelancer Project Management System  
> Student ID: O5560156  
> Purpose: Evidence that the application can be installed and run by a third party (marker), with Docker (primary) and host install (optional if running linux/mac).

---

## 1) Metadata

- Test date/time: 2025-09-09 23:05 BST
- Git commit hash: 8bdea65
- Test machine: macOS 15.6.1 M1
- Path tested: Docker (primary) / Host (optional)
- Tester: Abdullah Imran

---

## 2) Environment & Versions

- Docker: `docker --version` → 28.3.3, build 980b856
- Docker Compose: `docker compose version` → v2.39.2-desktop.1
- Node: `node -v` → v22.19.0
- Python: `python3 --version` → 3.12.11
- Postgres: postgres:16

---

## 3) Pre-flight checks

- Repo contains:
  - [x] `INSTALL.md`
  - [x] `docker-compose.yml`
  - [x] `deploy/nginx_docker.conf`
  - [x] `backend/requirements.txt`
  - [x] `frontend/package.json`
  - [x] `README.md`
- `settings.py` configured as:
  - [x] `ALLOWED_HOSTS=["*"]`
  - [x] `STATIC_URL="/static/"`, `STATIC_ROOT=.../static`
  - [x] CORS allows `http://localhost` and `http://127.0.0.1`
- `.env` not required for Docker (defaults provided in compose)

---

## 4) Docker install — step log

1. Build and start
   ```bash
   docker compose up -d --build
   ```
