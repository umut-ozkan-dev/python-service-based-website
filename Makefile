.PHONY: install-backend install-frontend dev-backend dev-frontend test-backend check-frontend migrate

install-backend:
	python3 -m venv backend/.venv && backend/.venv/bin/pip install --upgrade pip && backend/.venv/bin/pip install -r backend/requirements.txt

install-frontend:
	cd frontend && npm install

dev-backend:
	cd backend && .venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

test-backend:
	cd backend && .venv/bin/pytest -v && .venv/bin/ruff check .

check-frontend:
	cd frontend && npm run typecheck && npm run lint && npm run build

migrate:
	cd backend && .venv/bin/alembic upgrade head
