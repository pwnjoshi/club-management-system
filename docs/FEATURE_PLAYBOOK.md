# Feature Development Playbook (How To Add New Features Yourself)

Use this checklist every time you add a new feature.

## 1) Feature Planning Template

Before coding, answer:
1. What user problem are we solving?
2. What new backend endpoint(s) are needed?
3. What database data will be stored?
4. Which frontend page/component changes are needed?
5. What validation/error states are expected?

## 2) Backend Implementation Steps

1. Add/extend Entity if new data table/columns are needed.
2. Add/extend Repository for DB operations.
3. Create Request/Response DTOs if payload changes.
4. Add Service methods for business logic and validations.
5. Add Controller endpoint and response codes.
6. Add seed data only if needed for development demo.
7. Run backend tests.

## 3) Frontend Implementation Steps

1. Identify route/page for the feature.
2. Add API helper call in `api.js` usage.
3. Build UI states:
   - loading
   - success
   - error
4. Validate form input before API call.
5. Handle backend error messages gracefully.
6. Test route flow and data updates.

## 4) Integration Checklist

- Endpoint path in frontend exactly matches backend.
- Request JSON keys match DTO fields.
- CORS is allowed for frontend origin.
- Response data shape is handled in UI.
- Refresh/reload does not break user flow.

## 5) Example: Expand Dashboard Features

## Backend

1. Add endpoint:
- `GET /api/events/my?email=...` (currently handled implicitly on frontend via two queries)

2. Service/repository logic:
- Fetch registrations by email.
- Create a combined DTO (Data Transfer Object) so frontend uses one request.

## Frontend

1. Update `Dashboard.js` to utilize new combined DTO.
2. Render advanced statistics or certificates.

## 6) Git Workflow You Should Follow

1. Pull latest main.
2. Create feature branch.
3. Commit small logical units.
4. Run backend + frontend tests.
5. Open PR with summary and screenshots.
6. Merge after review.

## 7) Definition of Done (DoD)

Feature is done only when:
- Works in UI.
- Backend handles valid + invalid input.
- No console errors.
- Tests pass.
- Docs updated (API + flow).

## 8) Good Engineering Habits For This Project

1. Keep controllers thin; place rules in services.
2. Reuse `LoginResponse`-style structured responses or create feature-specific response DTOs.
3. Keep API names consistent (`/api/...`).
4. Add clear user-facing error messages.
5. Prefer incremental PRs over giant merges.
