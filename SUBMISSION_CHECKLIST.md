# Submission Checklist for TaskFlow Dashboard

Include the following items when you submit your assignment:

- Source code (entire project, excluding `node_modules`):
  - `backend/` (API, models, controllers, routes)
  - `taskflowdashboard/` (React frontend)
  - `package.json`, `backend/package.json`

- Documentation:
  - `README.md` - project overview and run instructions
  - `QUICKSTART.md` - quick setup guide
  - `RENDER_DEPLOYMENT.md` - deployment instructions (optional)

- Config files (safe copies):
  - `backend/.env.example` (do NOT include real `.env` with secrets)

- Logs (sanitized):
  - `logs/access.log` — sanitized access entries showing endpoints and statuses
  - `logs/error.log` — sanitized error and stack snippets

  Notes on logs:
  - Remove or redact any real secrets before submitting: JWTs, raw DB URIs, full email addresses if required.
  - In the provided logs the following placeholders are used: `USER_REDACTED`, `TASK_REDACTED`.

- Testing collection:
  - `TaskFlow.postman_collection.json` — API tests and example requests

- Optional extras:
  - Screenshots of UI (login/register/dashboard)
  - Short demo GIF

## How I generated the sample logs
Run the server and redirect stdout/stderr to files (example):

Windows PowerShell:
```powershell
New-Item -ItemType Directory -Path logs -Force
node backend/server.js *> logs\access.log 2> logs\error.log
# Stop the server after capturing enough lines (Ctrl+C)
```

Unix / Git Bash:
```bash
mkdir -p logs
node backend/server.js > logs/access.log 2> logs/error.log
```

Then sanitize any sensitive values by replacing them with placeholders:
- Replace JWTs and tokens with `[REDACTED_TOKEN]`
- Replace full emails or user IDs with `USER_REDACTED`
- Replace DB URIs with `MONGODB_URI_REDACTED`

---

If you want, I can also:
- Generate `logs.zip` containing the sanitized logs
- Create a short README inside the ZIP describing how the logs were produced

Tell me which additional option you'd like.