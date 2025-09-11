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
   Expected Output [All 4 containers running, frontend, backend, DB, nginx]
   Output:
    ✔ ou-project-backend               Built                                                                                                                                       0.0s
    ✔ ou-project-frontend              Built                                                                                                                                       0.0s
    ✔ Network ou-project_default       Created                                                                                                                                     0.0s
    ✔ Container ou-project-db-1        Healthy                                                                                                                                     5.9s
    ✔ Container ou-project-frontend-1  Started                                                                                                                                     0.4s
    ✔ Container ou-project-backend-1   Started                                                                                                                                     6.0s
    ✔ Container ou-project-nginx-1     Started

    docker compose ps -a
    Expected Output [Confirm all 4 containers are running]
    Output:
    ou-project-backend-1    ou-project-backend    "gunicorn project.ws…"   backend    8 seconds ago   Exited (3) 1 second ago
    ou-project-db-1         postgres:16           "docker-entrypoint.s…"   db         9 seconds ago   Up 8 seconds (healthy)    5432/tcp
    ou-project-frontend-1   ou-project-frontend   "docker-entrypoint.s…"   frontend   9 seconds ago   Up 8 seconds
    ou-project-nginx-1      nginx:1.25            "/docker-entrypoint.…"   nginx      8 seconds ago   Up 2 seconds              0.0.0.0:80->80/tcp, [::]:80->80/tcp



   ```
