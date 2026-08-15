# TaskFlow Manager

TaskFlow Manager is a personal workflow management application designed to help users organize, prioritize, and track their tasks efficiently. The application combines a Spring Boot backend, PostgreSQL database, and Angular frontend with a Kanban board.

The main goal is to provide a centralized workspace where users can manage tasks, deadlines, priorities, tags, and workflow status. An optional Python service can later analyze tasks and recommend which tasks should be completed first.

## Features

The core version of TaskFlow Manager will provide:

- Task creation, editing, and deletion
- Task priorities
- Deadlines
- Task status management
- Tags
- Kanban board
- Search and filtering
- Calendar view
- REST API
- PostgreSQL persistence

Optional advanced features:

- Personalized daily task recommendations
- Python recommendation service
- User authentication
- JWT based authorization
- Task analytics
- Docker based deployment

## Technology Stack

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security
- Maven

### Database

- PostgreSQL

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Angular Material or another UI library

### DevOps

- Docker
- Docker Compose
- Git
- GitHub

### Optional Recommendation Service

- Python
- FastAPI

---

# Project Architecture

The application follows a client server architecture.

```text
                   ┌──────────────────────┐
                   │      Angular         │
                   │      Frontend        │
                   │                      │
                   │   Kanban Board       │
                   │   Calendar           │
                   │   Forms              │
                   └──────────┬───────────┘
                              │
                           REST API
                              │
                   ┌──────────▼───────────┐
                   │     Spring Boot      │
                   │      Backend         │
                   │                      │
                   │ Controllers           │
                   │ Services              │
                   │ Repositories          │
                   └───────┬───────┬──────┘
                           │       │
                           │       │ HTTP
                           │       ▼
                           │  ┌─────────────┐
                           │  │   Python    │
                           │  │ Recommendation│
                           │  │   Service   │
                           │  └─────────────┘
                           │
                    ┌──────▼───────┐
                    │  PostgreSQL  │
                    │   Database   │
                    └──────────────┘
```

The Python service is optional and should only be added after the main application is stable.

---

# Project Structure

The final project should follow a structure similar to:

```text
taskflow-manager/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── angular.json
│   └── Dockerfile
│
├── recommendation-service/
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Development Roadmap

Build the application incrementally. Do not implement all features at once.

```text
1. Project setup
2. Database setup
3. Spring Boot backend
4. Task CRUD API
5. Backend testing
6. Angular frontend
7. Kanban board
8. Tags and filtering
9. Deadlines and calendar
10. Recommendation system
11. Python service
12. Authentication
13. Docker
14. Testing
15. Documentation
```

---

# 1. Create the Project

Create the main directory:

```bash
mkdir taskflow-manager
cd taskflow-manager
```

Initialize Git:

```bash
git init
```

Create the basic directories:

```bash
mkdir backend
mkdir frontend
mkdir recommendation-service
```

Create the first commit:

```bash
git add .
git commit -m "Initial project structure"
```

---

# 2. Set Up the Backend

Create a Spring Boot application using Spring Initializr.

Recommended dependencies:

```text
Spring Web
Spring Data JPA
PostgreSQL Driver
Validation
Lombok
```

The backend should follow a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Recommended package structure:

```text
backend/src/main/java/com/example/taskflow/

├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── exception/
└── config/
```

Do not put business logic inside controllers. Controllers should receive requests and delegate operations to services.

---

# 3. Set Up PostgreSQL

Use Docker for the database during development.

Example `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:latest
    container_name: taskflow-postgres
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: taskflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start PostgreSQL:

```bash
docker compose up -d
```

Check the container:

```bash
docker ps
```

The database should be available on:

```text
localhost:5432
```

---

# 4. Connect Spring Boot to PostgreSQL

Configure the database connection in `application.yml`.

Example:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/taskflow
    username: taskflow
    password: taskflow

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

For development, `ddl-auto: update` is acceptable.

For production, use database migrations such as Flyway or Liquibase.

---

# 5. Design the Database

Start with a simple data model.

## Task

The Task entity should contain:

```text
id
title
description
status
priority
deadline
createdAt
updatedAt
```

## Tag

The Tag entity should contain:

```text
id
name
```

A task can have multiple tags, and a tag can belong to multiple tasks.

```text
Task >────< Tag
```

Use a Many To Many relationship.

---

# 6. Implement Task Status

Create an enum:

```text
TODO
IN_PROGRESS
DONE
```

Tasks should always have exactly one status.

The status will later determine which Kanban column contains the task.

---

# 7. Implement Task Priority

Create a priority enum:

```text
LOW
MEDIUM
HIGH
URGENT
```

Priority will later be used by the recommendation system.

---

# 8. Create the Repository

Create:

```text
TaskRepository
```

It should extend:

```java
JpaRepository<Task, Long>
```

Start with the standard CRUD operations.

Add custom queries only when they are actually needed.

---

# 9. Create the Service Layer

Create:

```text
TaskService
```

The service should provide methods such as:

```text
createTask()
getTasks()
getTaskById()
updateTask()
deleteTask()
updateStatus()
```

The service layer should contain the application's business rules.

For example:

```text
A completed task cannot be moved to an invalid status.
A task title cannot be empty.
A task must have a valid priority.
```

---

# 10. Create REST Controllers

Create:

```text
TaskController
```

Recommended API:

```http
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
PATCH  /api/tasks/{id}/status
```

Example:

```http
GET /api/tasks
```

returns all tasks.

Creating a task:

```http
POST /api/tasks
Content-Type: application/json
```

Example request:

```json
{
  "title": "Implement Task API",
  "description": "Create CRUD endpoints",
  "priority": "HIGH",
  "status": "TODO",
  "deadline": "2026-08-20T18:00:00"
}
```

---

# 11. Use DTOs

Do not expose JPA entities directly through the API once the project grows.

Create:

```text
TaskRequest
TaskResponse
TagRequest
TagResponse
```

This separates the database model from the API model.

For example:

```text
HTTP Request
     ↓
TaskRequest
     ↓
TaskService
     ↓
Task Entity
     ↓
PostgreSQL
```

And:

```text
PostgreSQL
     ↓
Task Entity
     ↓
TaskResponse
     ↓
HTTP Response
```

---

# 12. Add Validation

Validate incoming requests.

Examples:

```java
@NotBlank
private String title;
```

Other validation rules can include:

```text
Title required
Priority required
Status required
Deadline valid
Tag names not empty
```

Return appropriate HTTP status codes such as:

```text
200 OK
201 CREATED
204 NO CONTENT
400 BAD REQUEST
404 NOT FOUND
```

---

# 13. Test the Backend

Before creating the Angular interface, verify that the complete backend works.

Test:

```text
Create task
Read tasks
Read single task
Update task
Delete task
Change task status
```

Use:

```text
Postman
Insomnia
curl
Swagger/OpenAPI
```

The following flow must work:

```text
HTTP Request
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
PostgreSQL
     ↓
Response
```

Do not start the frontend until this basic flow works reliably.

---

# 14. Create the Angular Frontend

Create the Angular application:

```bash
ng new frontend
```

Start it:

```bash
cd frontend
ng serve
```

The application should be available at:

```text
http://localhost:4200
```

---

# 15. Organize the Angular Application

Recommended structure:

```text
frontend/src/app/

├── core/
│   ├── services/
│   └── models/
│
├── features/
│   ├── tasks/
│   │   ├── task-board/
│   │   ├── task-card/
│   │   ├── task-form/
│   │   └── task-detail/
│   │
│   └── calendar/
│
├── shared/
│
└── app.routes.ts
```

Use feature based organization rather than putting everything into one large components directory.

---

# 16. Create the Task Model

Create a TypeScript model corresponding to the API.

Example:

```typescript
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  deadline: string;
}
```

Create matching enums:

```typescript
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}
```

---

# 17. Create the Angular Task Service

Create:

```text
TaskService
```

It should communicate with Spring Boot using Angular's HTTP client.

Required methods:

```text
getTasks()
getTask(id)
createTask(task)
updateTask(id, task)
deleteTask(id)
updateStatus(id, status)
```

Do not put API calls directly inside components.

Use the service as the communication layer.

---

# 18. Build the Kanban Board

The first major frontend feature should be the Kanban board.

Example:

```text
┌──────────────┬──────────────────┬──────────────┐
│ TODO         │ IN PROGRESS      │ DONE         │
├──────────────┼──────────────────┼──────────────┤
│ Task A       │ Task C           │ Task E       │
│ Task B       │ Task D           │ Task F       │
└──────────────┴──────────────────┴──────────────┘
```

Each task card should display:

```text
Title
Priority
Tags
Deadline
```

---

# 19. Implement Drag and Drop

The user should be able to move tasks between columns.

Example:

```text
TODO
  ↓
IN_PROGRESS
  ↓
DONE
```

When a task is moved, Angular must send:

```http
PATCH /api/tasks/{id}/status
```

The backend must save the new status in PostgreSQL.

The frontend should never treat the local UI state as the source of truth.

---

# 20. Implement Task Creation

Create a task form containing:

```text
Title
Description
Priority
Deadline
Tags
```

The process should be:

```text
User enters task
        ↓
Angular Form
        ↓
TaskService
        ↓
POST /api/tasks
        ↓
Spring Boot
        ↓
PostgreSQL
        ↓
Updated task list
```

Use Angular reactive forms for validation and maintainability.

---

# 21. Implement Editing and Deleting

Each task should provide actions such as:

```text
Edit
Delete
Change status
```

Deleting should use:

```http
DELETE /api/tasks/{id}
```

Editing should use:

```http
PUT /api/tasks/{id}
```

Avoid duplicating task logic across multiple components.

---

# 22. Add Tags

Create a tag management system.

Example:

```text
#University
#Backend
#Frontend
#Important
#Personal
```

Users should be able to assign multiple tags to a task.

The UI should allow filtering tasks by tag.

---

# 23. Add Search and Filters

Implement:

```text
Search by title
Filter by status
Filter by priority
Filter by tag
Filter by deadline
```

Example:

```text
Search: Spring

Priority:
All | Low | Medium | High | Urgent

Status:
All | Todo | In Progress | Done
```

Filtering can initially happen in Angular.

For larger datasets, move filtering to the backend using query parameters.

Example:

```http
GET /api/tasks?priority=HIGH&status=TODO
```

---

# 24. Implement Deadline Handling

Add deadline related states:

```text
Overdue
Due Today
Due Tomorrow
Upcoming
```

Example:

```text
Deadline: 13.08.2026
Status: Due Today
```

Overdue tasks should be clearly identifiable.

Keep date handling consistent between frontend, backend, and database. Use a clearly defined timezone strategy.

---

# 25. Add Calendar View

Add a calendar section to the application.

Navigation:

```text
Board | Calendar | Tasks
```

Tasks can be displayed based on their deadlines.

Initially, you do not need a separate calendar event entity.

A task deadline is enough for the first version.

---

# 26. Implement the Recommendation Logic

Only after the normal task system is working should you implement recommendations.

Start with a deterministic scoring algorithm.

Example:

```text
Priority:
URGENT  = 40
HIGH    = 30
MEDIUM  = 20
LOW     = 10
```

Deadline:

```text
Due today      = +40
Due tomorrow   = +25
Due this week  = +10
```

Overdue:

```text
Overdue = +50
```

The final score can be:

```text
Recommendation Score =
Priority Score
+ Deadline Score
+ Overdue Score
```

Sort tasks by their score and recommend the highest scoring tasks.

---

# 27. Build the Python Recommendation Service

Once the recommendation algorithm works inside the backend, extract it into a Python service.

Use FastAPI.

Example:

```text
recommendation-service/
│
├── app/
│   ├── main.py
│   ├── models.py
│   └── recommendation.py
│
├── requirements.txt
└── Dockerfile
```

API:

```http
POST /recommend
```

The Spring Boot backend sends task information to the Python service.

The Python service returns recommendations.

Architecture:

```text
Angular
   ↓
Spring Boot
   ↓
Python Recommendation Service
   ↓
Recommendation Result
   ↓
Angular
```

Do not introduce machine learning immediately. Start with rule based recommendations and only move to ML after enough historical user data exists.

---

# 28. Add Authentication

After the core features are complete, add users.

Create:

```text
User
```

Relationships:

```text
User
 │
 └── Tasks
```

Users should only be able to access their own data.

Use:

```text
Spring Security
JWT
Password hashing
Authorization
```

The API should verify the authenticated user before returning or modifying tasks.

---

# 29. Dockerize the Application

Once the application works locally, create containers for:

```text
Angular
Spring Boot
PostgreSQL
Python
```

The goal should be:

```bash
docker compose up
```

to start the complete application.

Example architecture:

```text
┌───────────────┐
│ Angular       │
│ Container     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Spring Boot   │
│ Container     │
└───────┬───────┘
        │
   ┌────┴────────────┐
   ▼                 ▼
PostgreSQL       Python API
Container        Container
```

---

# 30. Add Automated Tests

Testing should cover both the backend and frontend.

## Backend

Test:

```text
TaskService
TaskController
Validation
Repositories
Authentication
Recommendation logic
```

Use unit tests and integration tests.

## Frontend

Test:

```text
TaskService
Task Board
Task Form
Filtering
Drag and Drop
```

The most important integration flow is:

```text
Angular
  ↓
REST API
  ↓
Spring Boot
  ↓
PostgreSQL
```

---

# 31. API Documentation

Add OpenAPI and Swagger documentation.

Document:

```text
Endpoints
Request bodies
Response bodies
Errors
Authentication
```

This makes the backend easier to test, maintain, and demonstrate.

---

# 32. Git Workflow

Use feature branches for major features.

Example:

```text
main
develop
feature/task-crud
feature/kanban-board
feature/tags
feature/calendar
feature/recommendations
feature/authentication
feature/docker
```

Use meaningful commit messages:

```text
feat: add task entity
feat: implement task CRUD API
feat: create kanban board
feat: add drag and drop
feat: add task filtering
feat: implement recommendations
fix: validate task deadline
test: add task service tests
```

Keep commits small enough that each commit represents one logical change.

---

# 33. Development Milestones

## Milestone 1: Backend MVP

The backend must support:

```text
Task CRUD
PostgreSQL
Validation
REST API
```

## Milestone 2: Frontend MVP

The frontend must support:

```text
Task list
Task creation
Task editing
Task deletion
Kanban board
```

## Milestone 3: Task Management

Add:

```text
Tags
Search
Filters
Priorities
Deadlines
```

## Milestone 4: Productivity Features

Add:

```text
Calendar
Recommendations
```

## Milestone 5: Advanced Architecture

Add:

```text
Python service
Authentication
Authorization
Docker
```

## Milestone 6: Production Quality

Add:

```text
Tests
API documentation
Error handling
Logging
Environment configuration
CI/CD
```

---

# Implementation Guidelines

## Keep Responsibilities Separated

Use the following rule:

```text
Controller = HTTP communication
Service = Business logic
Repository = Database access
Entity = Persistence model
DTO = API model
Component = UI logic
Angular Service = API communication
```

Avoid putting database logic inside controllers or business logic inside Angular templates.

## Design for Extension

The initial Task entity should be simple, but the architecture should allow future features.

Potential future entities:

```text
User
Project
Task
Tag
Comment
CalendarEvent
Notification
Recommendation
```

Do not prematurely implement all of them.

## Keep the Backend as the Source of Truth

The backend is responsible for persistent application state.

The frontend should display and interact with that state, but important state changes must be persisted through the API.

## Validate on Both Sides

Angular validation improves user experience.

Backend validation provides actual application security and data integrity.

Never rely only on frontend validation.

## Handle Errors Explicitly

The backend should return meaningful HTTP responses.

Example:

```text
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

The frontend should display useful error messages rather than silently ignoring failed requests.

## Keep Configuration Outside the Code

Do not hard code:

```text
Database passwords
JWT secrets
Production URLs
API keys
```

Use environment variables and environment specific configuration.

## Do Not Overengineer the MVP

The first working version should focus on:

```text
Tasks
Status
Priority
Deadline
Tags
Kanban Board
PostgreSQL
```

Advanced features should be added only after this foundation is stable.

---

# Definition of Done for the MVP

The MVP is complete when a user can:

```text
Create a task
Edit a task
Delete a task
Assign a priority
Assign tags
Set a deadline
Move a task between Kanban columns
Search tasks
Filter tasks
Close and reopen the application
```

and all task data remains stored in PostgreSQL.

The complete system should then work through:

```text
Angular
   ↓
Spring Boot REST API
   ↓
PostgreSQL
```

After that foundation is stable, recommendations, Python, authentication, Docker, and additional productivity features can be implemented incrementally.

---

# Final Goal

The finished TaskFlow Manager should be a full stack productivity application demonstrating:

```text
Frontend Development
Backend Development
REST API Design
Database Design
Software Architecture
Authentication
Containerization
Testing
API Integration
Recommendation Systems
```

The project should prioritize a clean architecture and a working end to end system over the number of features. A smaller application that is well structured, tested, documented, and deployable is more valuable than a large application with tightly coupled and unfinished components.