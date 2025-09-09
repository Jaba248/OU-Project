# Freelancer Project Management System

## TM470 EMA

A self-hosted project management system for freelancers and small teams. Manage clients, projects and tasks, and generate test-mode invoices via Stripe — all in one place.

> This repository accompanies the TM470 final project submission.

---

## Features

- **Clients & Projects** – Create and manage clients with associated projects.
- **Tasks** – Add, edit, and track tasks per project.
- **Authentication** – Email/password sign-up & sign-in (token based).
- **Invoices (test mode)** – Generate Stripe-hosted test invoices and store invoice metadata.
- **Decoupled architecture** – React frontend + Django GraphQL API backend.
- **Deployment ready** – Docker Compose stack with Postgres, Gunicorn, and Nginx; Host install option documented.

---

## Tech Stack

- **Frontend:** React, Vite, Apollo Client
- **Backend:** Django, Graphene-Django (GraphQL)
- **Database:** PostgreSQL in production (SQLite in development)
- **Runtime / Ops:** Docker, Nginx, Gunicorn

---

## Quick Start

The simplest way to run the app is Docker.

```bash
# from repo root
docker compose up -d --build
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
docker compose exec backend python manage.py createsuperuser
```

---

**Submission note:**  
This repository forms part of the TM470 End-of-Module Assessment submission by student O5560156.
