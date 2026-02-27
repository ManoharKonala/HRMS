# Human Resource Management System (HRMS)

A full-stack Human Resource Management System built with a robust **FastAPI (Python)** backend and a modern **Next.js (React)** frontend, fully containerized using Docker and backed by **PostgreSQL**.

## Architecture & Tech Stack

This project is separated into two primary microservices that seamlessly interact with each other and the database:
- **Backend (`/backend`)**: Built with FastAPI. Uses `asyncpg` for high-performance Async database connections and SQLAlchemy for ORM modeling matching the production-grade PostgreSQL schema. Includes `passlib` and `python-jose` for JWT-based secure authentication.
- **Frontend (`/frontend`)**: Built with Next.js App Router and Tailwind CSS. Provides a premium, glassmorphism-inspired UI with rich analytics and form handling.
- **Database**: PostgreSQL 15 running independently using Docker volumes.

## Included Features

The infrastructure is already set up and functioning with the following core modules:
1. **Real-time Dashboard**: Live fetching of workforce statistics and pending requests straight from the database.
2. **Employee Management**: A complete visual employee directory. Includes secure RBAC-controlled mechanisms allowing `SuperAdmin` or `HR` roles to add new employees (and secure user accounts) to the organization.
3. **Time-Off & Leaves System**: Employees can submit time-off requests detailing dates and reasons. High-level administrators can review, approve, or reject these requests seamlessly.
4. **JWT Security**: Complete authentication system built directly over the API with Bearer tokens mapping heavily to `UserAccount` roles.

## Getting Started

### Prerequisites
You only need to have **Docker** and **Docker Compose** installed on your system. No local installations of Node.js, Python, or PostgreSQL are required.

### Running the Application

1. **Clone the repository** and navigate to the root directory:
   ```bash
   cd HRMS
   ```

2. **Build and start the services** using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
   *This command will pull the base images, build the Next.js production optimize bundle, configure Python environments, establish the Postgres cluster, and bind all network routes.*

3. **Access the application**:
   - **Frontend UI:** Open your browser to `http://localhost:3000`
   - **Backend API Docs (Swagger UI):** Explore the interactive API directly at `http://localhost:8000/docs`

### Default Admin Login

A default `SuperAdmin` account has already been seeded into the database for immediate testing. You can use this to explore the dashboard or create new employees.

- **Email:** `admin@hrms.com`
- **Password:** `admin123`

---
*Note: Due to security strictness with CORS protocols, ensure you always visit the frontend on `localhost:3000` or `127.0.0.1:3000` instead of local IP routing during development.*
