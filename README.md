# Time Tracker Application

A full-stack browser-based time tracking application that allows users to assign daily working hours to different projects. The application includes a frontend (Angular SPA), a backend (Spring Boot REST API), and a PostgreSQL database for persistent storage.

## Features

- User registration and JWT-based authentication
- Project management with configurable budgets (hours and cost) and hourly rates
- Daily time entry logging with required fields (date, project, hours)
- Automatic cost calculation: `hours × (project.hourlyRate ?? user.defaultHourlyRate)`
- Budget validation on time entry creation/update (returns 400 if exceeded)
- Weekly overview: total hours per day
- Monthly overview: total hours per month
- RESTful API with Spring Data REST auto-generated endpoints + custom overviews
- Interactive API documentation & testing via Swagger UI
- Containerized deployment with Docker & Docker Compose

## Technologies

**Backend**
- Java 21
- Spring Boot 3.3.x
- Spring Data REST (auto-exposes repositories as REST endpoints)
- Spring Data JPA + Hibernate
- Spring Security + JWT (custom filter)
- PostgreSQL
- springdoc-openapi (Swagger UI)
- Gradle (build tool)

**Frontend**
- Angular 18 (standalone components, signals, RxJS)
- Tailwind CSS
- FormsModule for two-way binding
- Nginx (production serve)

**Infrastructure**
- Docker + Docker Compose (database, backend, frontend)
- Persistent PostgreSQL volume

**Data Model Overview**

| Entity        | Key Fields                                      | Relationships / Notes |
|---------------|-------------------------------------------------|-----------------------|
| **User**      | id (PK), username (unique), password (BCrypt hashed), defaultHourlyRate | OneToMany TimeEntry. Implements UserDetails for security. |
| **Project**   | id (PK), name, budgetHours, budgetCost, hourlyRate (optional) | OneToMany TimeEntry. Rate fallback to user default. |
| **TimeEntry** | id (PK), date (LocalDate), hours (double), user (FK), project (FK) | ManyToOne User & Project. Budget checks on save. |

- **Cost calculation**: `hours × (project.hourlyRate ?? user.defaultHourlyRate)`
- **Budget enforcement**: On TimeEntry save, sum all entries for the project → if sum(hours) > budgetHours **or** sum(costs) > budgetCost → 400 Bad Request

## 1. How to Start from Scratch

### Prerequisites

- Docker & Docker Compose
- Git
- Node.js 20+ & npm (for frontend development)
- Java 21 JDK (optional for local backend dev)

### Clone & Run

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/time-tracker.git
cd time-tracker

# 2. Build backend JAR
cd backend
./gradlew clean build
cd ..

# 3. Start database + backend (recommended)
docker compose up --build

# Wait ~30–60 seconds for backend startup

# 4. Open Swagger UI (API documentation & testing)
http://localhost:8080/swagger-ui/index.html

# 5. (Optional) Start frontend in development mode (separate terminal)
cd frontend
npm install
ng serve
# → open http://localhost:4200
