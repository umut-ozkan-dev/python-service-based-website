# Relay60

Done-for-you 60-second AI lead response, CRM sync, and appointment booking for appointment-based businesses in the US and UK.

Marketing site: `frontend/` (Next.js 14). API: `backend/` (FastAPI, SQLite by default, PostgreSQL optional).

## Local development

```bash
make install-backend
make install-frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
make migrate
```

In two terminals:

```bash
make dev-backend
make dev-frontend
```

- API: http://localhost:8000/api/v1/health
- Site: http://localhost:3000
- Admin list: `GET /api/v1/admin/leads` with header `X-Admin-API-Key` from `backend/.env`

No paid API keys are required. Empty webhook URLs use the local dispatch logger.

## Checks

```bash
make test-backend
make check-frontend
```
