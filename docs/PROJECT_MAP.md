# Project Map (Which File Does What)

## Repository Layout

- `backend/`: Spring Boot application (Java + JPA + REST APIs)
- `frontend/`: React application (UI + routes + API calls)
- `docs/`: Documentation and learning guides

## Backend Map

### Entry + Config

- `backend/src/main/java/com/cms/collegeclub/CollegeclubApplication.java`
  - Spring Boot entry point (`main` method).
- `backend/src/main/resources/application.properties`
  - App port, datasource, JPA settings.
- `backend/src/main/resources/data.sql`
  - Initial seed data (default user + sample events).
- `backend/pom.xml`
  - Maven dependencies and build plugins.

### Controllers (HTTP API layer)

- `backend/src/main/java/com/cms/collegeclub/controller/UsersController.java`
  - Auth endpoints (`/api/auth/register`, `/api/auth/login`).
- `backend/src/main/java/com/cms/collegeclub/controller/EventController.java`
  - Event listing/creation and event registration endpoints.

### Service Layer (business logic)

- `backend/src/main/java/com/cms/collegeclub/service/UserService.java`
  - Register/login validation and user lookup logic.

### Entities (DB table models)

- `backend/src/main/java/com/cms/collegeclub/entity/Users.java`
  - User table model (`email`, `name`, `password`).
- `backend/src/main/java/com/cms/collegeclub/entity/Event.java`
  - Event table model (`title`, `eventDate`, `location`, `description`, `seatsAvailable`).
- `backend/src/main/java/com/cms/collegeclub/entity/EventRegistration.java`
  - Event registration model (`email`, `eventId`, `registeredAt`).

### Repositories (DB operations)

- `backend/src/main/java/com/cms/collegeclub/repository/UsersRepo.java`
  - CRUD for users.
- `backend/src/main/java/com/cms/collegeclub/repository/EventRepo.java`
  - CRUD for events.
- `backend/src/main/java/com/cms/collegeclub/repository/EventRegistrationRepo.java`
  - CRUD + custom checks (already registered, by user email).

### Request/Response DTOs

- `backend/src/main/java/com/cms/collegeclub/requests/LoginRequest.java`
  - Login payload.
- `backend/src/main/java/com/cms/collegeclub/requests/LoginResponse.java`
  - Standard success/failure response message.
- `backend/src/main/java/com/cms/collegeclub/requests/EventRegistrationRequest.java`
  - Event registration payload.

## Frontend Map

### Routing + App Shell

- `frontend/src/App.js`
  - Route setup (`/`, `/login`, `/register`, `/dashboard`, `/events`).
- `frontend/src/index.js`
  - React root mounting.

### Pages

- `frontend/src/PublicHome.js`
  - Public About page (for not-logged-in users).
- `frontend/src/Login.js`
  - Login UI + API call.
- `frontend/src/Register.js`
  - Register UI + API call.
- `frontend/src/Dashboard.js`
  - Logged-in dashboard displaying registered events.
- `frontend/src/Events.js`
  - Event list + event registration UI.

### API Layer

- `frontend/src/api.js`
  - Shared API helper using `fetch` and uniform error handling.

### Styling + Tests

- `frontend/src/App.css`
  - Main component/page styling.
- `frontend/src/index.css`
  - Base styles and fonts.
- `frontend/src/App.test.js`
  - Basic route-level render test.

## Single-Line Mental Model

React pages call Spring Boot REST endpoints; Spring Boot validates data, reads/writes database through JPA repositories, and returns JSON back to React.
