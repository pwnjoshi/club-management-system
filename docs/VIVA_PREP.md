# Viva Preparation (Project Questions + Strong Answers)

## Section A: Project Basics

### Q1. What is your project?
A: It is a full-stack College Club Management System that allows students to register/login, browse club events, and register for events. It is built with Spring Boot backend and React frontend.

### Q2. Why did you choose this problem statement?
A: Club activities are often managed manually through chats/forms. We wanted a centralized platform to improve event visibility, registration accuracy, and operational efficiency.

### Q3. What are your core features right now?
A:
1. Public modern landing page explaining the platform.
2. User registration and login.
3. Event listing.
4. Event seat registration.
5. Interactive dashboard showing user registered events.

## Section B: Technical Architecture

### Q4. Explain architecture in one minute.
A: We use a client-server architecture. React frontend sends HTTP JSON requests to Spring Boot REST APIs. Spring controllers call service logic, services interact with JPA repositories, repositories persist entity objects in the database.

### Q5. How does Spring Boot communicate with React?
A: Via REST endpoints. React calls backend APIs using `fetch` in `api.js`. Backend returns JSON responses, and React updates UI state accordingly.

### Q6. Why use JPA repositories?
A: JPA repositories reduce boilerplate for CRUD operations and support custom queries through method naming conventions, which speeds up development.

## Section C: API and Data Flow

### Q7. Explain login flow.
A:
1. User submits email/password in React.
2. React sends POST `/api/auth/login`.
3. Backend validates credentials in service layer.
4. Response contains success/message and user data.
5. React stores user in localStorage and redirects to dashboard.

### Q8. Explain event registration flow.
A:
1. User clicks register on an event.
2. React sends POST `/api/events/{id}/register`.
3. Backend checks event exists, not already registered, seat > 0.
4. Backend saves registration and decrements seats.
5. React updates UI and message.

### Q9. What validations have you implemented?
A:
- Email required.
- Password minimum length.
- Duplicate user prevention.
- Duplicate event registration prevention.
- Seat availability check.

## Section D: DB and Configuration

### Q10. Which database are you using?
A: Default is H2 in-memory for local development. MySQL dependency is also present and can be enabled via datasource environment variables.

### Q11. Why H2 for development?
A: It gives fast setup, zero external dependency, and makes local testing easy.

## Section E: Security and Limitations

### Q12. What are current limitations?
A:
1. Plain text passwords.
2. No JWT/session auth yet.
3. No role-based authorization.

### Q13. How will you secure it in next iteration?
A:
1. Use BCrypt password hashing.
2. Add JWT token generation/validation.
3. Add role-based access control for admin/student features.
4. Protect backend routes with Spring Security.

## Section F: Future Scope

### Q14. What features can be added next?
A:
1. My registrations page.
2. Event cancellation and waitlist.
3. Attendance marking.
4. Certificate generation/verification.
5. Admin analytics dashboard.

### Q15. If asked "what did you personally learn?"
A: I learned full-stack integration, REST API design, state management in React, layered backend design in Spring Boot, debugging API/data flow issues, and managing project changes with Git branching.

## Section G: Rapid-Fire Short Answers

- Why REST? Stateless, simple, easy frontend integration.
- Why React? Component reusability, fast UI updates, strong ecosystem.
- Why Spring Boot? Fast backend setup, enterprise-ready patterns.
- Why DTOs? Clean API contracts and safer request/response handling.
- Why service layer? Keeps business logic separate from controllers.

## Final Viva Tip

When answering, always use this structure:
1. What problem.
2. How you solved it technically.
3. What result/benefit you got.
4. What improvement comes next.
