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
    ✔ ou-project-frontend                Built                                                                                                                                     0.0s
    ✔ ou-project-backend                 Built                                                                                                                                     0.0s
    ✔ Network ou-project_default         Created                                                                                                                                   0.0s
    ✔ Volume "ou-project_frontend_dist"  Created                                                                                                                                   0.0s
    ✔ Volume "ou-project_db_data"        Created                                                                                                                                   0.0s
    ✔ Volume "ou-project_static_data"    Created                                                                                                                                   0.0s
    ✔ Container ou-project-frontend-1    Started                                                                                                                                   0.4s
    ✔ Container ou-project-db-1          Healthy                                                                                                                                   5.9s
    ✔ Container ou-project-backend-1     Started                                                                                                                                   6.0s
    ✔ Container ou-project-nginx-1       Started

    docker compose ps -a
    Expected Output [Confirm all 4 containers are running]
    Output:
      NAME                    IMAGE                 COMMAND                  SERVICE    CREATED         STATUS                   PORTS
      ou-project-backend-1    ou-project-backend    "gunicorn project.ws…"   backend    2 minutes ago   Up 2 minutes             8000/tcp
      ou-project-db-1         postgres:16           "docker-entrypoint.s…"   db         2 minutes ago   Up 2 minutes (healthy)   5432/tcp
      ou-project-frontend-1   ou-project-frontend   "docker-entrypoint.s…"   frontend   2 minutes ago   Up 2 minutes
      ou-project-nginx-1      nginx:1.25            "/docker-entrypoint.…"   nginx      2 minutes ago   Up 2 minutes             0.0.0.0:80->80/tcp, [::]:80->80/tcp

    docker compose exec backend python manage.py migrate
    Output:
      Operations to perform:
      Apply all migrations: admin, api, auth, contenttypes, sessions
      Running migrations:
      Applying contenttypes.0001_initial... OK
      Applying auth.0001_initial... OK
      Applying admin.0001_initial... OK
      Applying admin.0002_logentry_remove_auto_add... OK
      Applying admin.0003_logentry_add_action_flag_choices... OK
      Applying api.0001_initial... OK
      Applying api.0002_remove_task_is_completed_task_description_and_more... OK
      Applying api.0003_invoice_stripe_invoice_url_project_paid_and_more... OK
      Applying api.0004_invoice_amount_paid_alter_invoice_amount... OK
      Applying api.0005_alter_invoice_due_date... OK
      Applying contenttypes.0002_remove_content_type_name... OK
      Applying auth.0002_alter_permission_name_max_length... OK
      Applying auth.0003_alter_user_email_max_length... OK
      Applying auth.0004_alter_user_username_opts... OK
      Applying auth.0005_alter_user_last_login_null... OK
      Applying auth.0006_require_contenttypes_0002... OK
      Applying auth.0007_alter_validators_add_error_messages... OK
      Applying auth.0008_alter_user_username_max_length... OK
      Applying auth.0009_alter_user_last_name_max_length... OK
      Applying auth.0010_alter_group_name_max_length... OK
      Applying auth.0011_update_proxy_permissions... OK
      Applying auth.0012_alter_user_first_name_max_length... OK
      Applying sessions.0001_initial... OK

    docker compose exec backend python manage.py collectstatic --noinput
    output:
    128 static files copied to '/app/static'.
   ```

2. Application Test

Visual using chrome go to localhost -> fully working, account created project, client created + strip invoice generated, everything working as intended

Command test

```
  curl -I http://localhost
  Output:
    HTTP/1.1 200 OK
    Server: nginx/1.25.5
    Date: Thu, 11 Sep 2025 13:45:51 GMT
    Content-Type: text/html
    Content-Length: 459
    Last-Modified: Thu, 11 Sep 2025 13:36:06 GMT
    Connection: keep-alive
    ETag: "68c2d046-1cb"
    Accept-Ranges: bytes

  curl -i http://localhost/graphql
  Output:
    HTTP/1.1 400 Bad Request
    Server: nginx/1.25.5
    Date: Thu, 11 Sep 2025 13:46:04 GMT
    Content-Type: application/json
    Content-Length: 53
    Connection: keep-alive
    Vary: Cookie, origin
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: same-origin
    Cross-Origin-Opener-Policy: same-origin
    Set-Cookie: csrftoken=Kts6JMKMb2IhMYebyMslU6s52ufL2K1M; expires=Thu, 10 Sep 2026 13:46:04 GMT; Max-Age=31449600; Path=/; SameSite=Lax

    {"errors":[{"message":"Must provide query string."}]}
```

Both outputs match our expected outputs, first we can see nginx and returning 200, for the second command we say must provide query string which is the default response from a graphql api

Save artifacts
curl -i http://localhost > docs/artifacts/http-root.txt
curl -i http://localhost/graphql > docs/artifacts/http-graphql.txt
docker compose exec backend curl -i http://localhost:8000/admin/login/ > docs/artifacts/backend-admin.txt
