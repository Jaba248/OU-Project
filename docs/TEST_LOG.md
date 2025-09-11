# Installation & Deployment Test Log

Project: Freelancer Project Management System
Student ID: O5560156
Purpose: Evidence that the application can be installed and run by a third party (marker), with Docker (primary) and host install (optional if running Linux/macOS).

---

## 1) Metadata

- Test date/time: 2025-09-09 23:05 BST
- Git commit hash: 8bdea65
- Test machine: macOS 15.6.1 (Apple Silicon)
- Path tested: Docker (primary) and Host (dry run)
- Tester: Abdullah Imran

---

## 2) Environment & Versions

- Docker: 28.3.3, build 980b856
- Docker Compose: v2.39.2-desktop.1
- Node: v22.19.0
- Python: 3.12.11
- Postgres: 16 (container)

---

## 3) Pre-flight checks

Repository contains:

- INSTALL.md
- docker-compose.yml
- deploy/nginx_docker.conf
- backend/requirements.txt
- frontend/package.json
- README.md

Backend settings highlights:

- ALLOWED_HOSTS = ["*"]
- STATIC_URL = "/static/", STATIC_ROOT is set
- CORS allowed: http://localhost, http://127.0.0.1
- Docker path does not require a .env file

---

## 4) Docker install — steps and outcomes

1. Build and start

Commands:

- docker compose up -d --build
- docker compose ps -a

Outcome:

- All four containers are up: db (healthy), backend, frontend, nginx.

2. Database and static setup

Commands:

- docker compose exec backend python manage.py migrate
- docker compose exec backend python manage.py collectstatic --noinput

Outcome:

- Migrations applied successfully (admin, api, auth, contenttypes, sessions).
- 128 static files collected to /app/static.

3. Quick service check

Commands:

- docker compose restart backend
- docker compose ps -a

Outcome:

- Backend remains healthy and listening on 8000 inside the network. Nginx serves on port 80.

---

## 5) Application tests

### Browser flow

- Opened http://localhost — frontend loads.
- Registered a new user; then logged in.
- Created a Client, Project, and multiple Tasks via the dashboard UI.
- Generated a Stripe test invoice successfully (Stripe-hosted test link opened; screenshot captured).

### API checks

Commands:

- curl -I http://localhost
- curl -i http://localhost/graphql

Outcomes:

- `/` responded 200 OK (nginx).
- `/graphql` responded 400 JSON: “Must provide query string.” (expected for a GET without body).

### Frontend network verification

- Verified in Chrome DevTools: all GraphQL requests from the SPA go to `/graphql` (reverse-proxied by nginx to Django).
- DELETE mutation for a task shows a successful HTTP response.

---

## 6) Artifacts captured (docs/artifacts/)

- docker-all-final.log — full compose logs after successful run
- docker-ps-final.txt — container status after setup
- backend-after-setup.log — backend logs after migration/collectstatic
- backend_after_rebuild.log — backend logs from rebuild cycle
- backend-admin.txt — response from /admin/login/ (inside backend)
- http-root.txt — curl -i http://localhost
- http-graphql.txt — curl -i http://localhost/graphql
- ui-client-created.png — UI screenshot
- ui-project-created.png — UI screenshot
- ui-tasks-created.png — UI screenshot
- stripe-invoice.png — Stripe test invoice screenshot
- proof-of-nginx-graphql-proxy.png — DevTools network screenshot showing requests to /graphql
  (Rename from “proof-of-nginx graphql-proxy.png” to remove spaces)

---

## 7) Host install (dry run)

Commands:

- export USE_POSTGRES=false
- python manage.py runserver

Outcome:

- App runs with SQLite and serves /graphql on port 8000 locally in development mode.

---

## 8) Notes

- Docker Compose “version” key warning has been addressed in the compose file.
- Production SPA uses `/graphql` (same-origin, via nginx). Development uses http://localhost:8000/graphql or VITE_API_URL if set.
- Stripe is in test mode.

---

## 9) Conclusion

Docker-based deployment verified end-to-end:

- Nginx serves the built SPA and proxies /graphql to Django (Gunicorn).
- Django connects to Postgres in the container network.
- UI flows (auth, client/project/task CRUD) and Stripe test invoice creation work.
- Host-based development run with SQLite also confirmed (dry run).
