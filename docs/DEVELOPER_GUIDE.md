# Full Developer Guide (Spring Boot + React)

This guide explains how this project works end-to-end and how backend and frontend communicate.

## 1) Tech Stack and Runtime

- Backend: Spring Boot 4 + Spring Web MVC + Spring Data JPA
- Database (default): H2 in-memory
- Frontend: React (CRA)
- Communication: HTTP REST APIs with JSON

Ports:
- Frontend: `3000`
- Backend: `8082`

## 2) How Spring Boot Works in This Project

### 2.1 Startup lifecycle

1. `CollegeclubApplication` starts Spring context.
2. Spring scans components (`@RestController`, `@Service`, `@Repository`, `@Entity`).
3. JPA creates tables from entity classes.
4. `data.sql` seeds initial data.
5. Backend starts HTTP server on port `8082`.

### 2.2 Layered architecture used here

Flow:
1. Controller receives request.
2. Controller calls Service.
3. Service performs validation and business rules.
4. Service uses Repository for DB access.
5. Repository maps data via Entity classes.
6. Controller returns JSON response.

## 3) How React Works in This Project

### 3.1 Routing

`App.js` uses route-based pages:
- `/` -> public about homepage
- `/login` -> sign-in page
- `/register` -> sign-up page
- `/dashboard` -> logged-in dashboard with registered events
- `/events` -> event listing and registration

### 3.2 State and navigation

- Login success stores user object in `localStorage` as `clubUser`.
- Protected pages (`Dashboard`, `Events`) check for `clubUser`.
- If not present, user is redirected to `/login`.

### 3.3 API integration

`api.js` is a shared wrapper around `fetch`:
- Sends JSON headers automatically.
- Parses JSON response.
- Throws normalized error for non-2xx responses.

## 4) How React Communicates with Spring Boot

## Request chain example: Login

1. User fills login form in `Login.js`.
2. Frontend calls `POST /api/auth/login` using `api.post`.
3. Spring controller (`UsersController`) receives JSON.
4. Service (`UserService`) validates credentials.
5. Service checks DB via `UsersRepo`.
6. Controller returns `LoginResponse` JSON.
7. React stores user in `localStorage` and navigates to `/dashboard`.

## Request chain example: Register for event

1. User clicks Register in `Events.js`.
2. Frontend calls `POST /api/events/{eventId}/register`.
3. Spring controller (`EventController`) validates event and seat availability.
4. Repository checks duplicate registration.
5. Backend creates `EventRegistration`, decrements event seat count.
6. Response message sent to React.
7. React updates seat count on UI.

## 5) Local Setup and Run

## Prerequisites

- Java 17+
- Node.js 18+ and npm

## Run backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

## Run frontend

```powershell
cd frontend
npm install
npm start
```

Open:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8082`

## Tests

Backend:

```powershell
cd backend
.\mvnw.cmd test
```

Frontend:

```powershell
cd frontend
npm test -- --watch=false
```

## 6) Database Notes

By default:
- H2 in-memory DB is used.
- Data resets on restart (unless external DB config used).

To switch to MySQL later, set environment variables:
- `DB_URL`
- `DB_DRIVER`
- `DB_USERNAME`
- `DB_PASSWORD`

## 7) Security Caveat (Important)

Current implementation is for learning/demo:
- Passwords are plain text.
- No JWT/session auth yet.
- Protected routes are frontend-only checks.

Production-ready next steps:
1. Password hashing (BCrypt).
2. JWT-based auth in backend.
3. Role-based authorization (admin/student).
4. Backend endpoint protection.

## 8) Common Errors and Fixes

### Frontend says "Failed to fetch"

Cause:
- Backend not running or wrong base URL.

Fix:
- Start backend on `8082`.
- Verify `api.js` base URL.

### CORS error in browser

Cause:
- Origin mismatch.

Fix:
- Ensure frontend runs on `http://localhost:3000`.
- Keep `@CrossOrigin` origin in controllers aligned.

### Event seed SQL failure

Cause:
- Column order mismatch in insert/merge.

Fix:
- Use explicit column names in `data.sql` (already done).

## 9) What To Read First (If You Forget Everything)

1. `PROJECT_MAP.md`
2. `frontend/src/App.js`
3. `frontend/src/api.js`
4. `backend/src/main/java/com/cms/collegeclub/controller/UsersController.java`
5. `backend/src/main/java/com/cms/collegeclub/controller/EventController.java`

These five files are enough to reconstruct the full data flow.
