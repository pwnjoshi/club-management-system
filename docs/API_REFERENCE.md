# API Reference (Current Project)

Base URL (local): `http://localhost:8082`

## 1) Auth APIs

### POST `/api/auth/register`

Purpose: Create a new user.

Request body:

```json
{
  "name": "Pawan Joshi",
  "email": "pawan@college.edu",
  "password": "12345"
}
```

Success response (`200`):

```json
{
  "success": true,
  "message": "Registration successful",
  "name": "Pawan Joshi",
  "email": "pawan@college.edu"
}
```

Error response (`400`) examples:
- `Email is required`
- `Password must be at least 5 characters`
- `User with this email already exists`

### POST `/api/auth/login`

Purpose: Authenticate user.

Request body:

```json
{
  "email": "pawan@college.edu",
  "password": "12345"
}
```

Success response (`200`):

```json
{
  "success": true,
  "message": "Login successful",
  "name": "Pawan Joshi",
  "email": "pawan@college.edu"
}
```

Failure response (`401`):

```json
{
  "success": false,
  "message": "Invalid email or password",
  "name": null,
  "email": null
}
```

## 2) Events APIs

### GET `/api/events`

Purpose: Fetch all events.

Response (`200`):

```json
[
  {
    "id": 1,
    "title": "TechFest 2026",
    "eventDate": "2026-04-20",
    "location": "Main Auditorium",
    "description": "Coding challenges, demos, and startup talks.",
    "seatsAvailable": 120
  }
]
```

### POST `/api/events`

Purpose: Create event (currently open endpoint).

Request body:

```json
{
  "title": "AI Workshop",
  "eventDate": "2026-05-22",
  "location": "Seminar Hall",
  "description": "Intro to AI tools and use-cases.",
  "seatsAvailable": 80
}
```

Behavior note:
- If `seatsAvailable` is missing or less than 1, backend sets it to `1`.

### POST `/api/events/{eventId}/register`

Purpose: Register a user to an event.

Request body:

```json
{
  "email": "pawan@college.edu"
}
```

Success (`200`):

```json
{
  "success": true,
  "message": "Event registration successful",
  "name": null,
  "email": "pawan@college.edu"
}
```

Common errors:
- `400`: Email missing
- `400`: Already registered
- `400`: No seats left
- `404`: Event not found

### GET `/api/events/registrations?email={email}`

Purpose:
- Without query param: all registrations.
- With `email`: registrations for one user.

Response (`200`):

```json
[
  {
    "id": 1,
    "email": "pawan@college.edu",
    "eventId": 2,
    "registeredAt": "2026-04-08T14:05:22.102"
  }
]
```

## CORS

Controllers are configured with:
- `@CrossOrigin(origins = "http://localhost:3000")`

So the React dev server can call the backend locally.
