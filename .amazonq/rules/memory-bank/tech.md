# Technology Stack

## Backend

### Language & Runtime
- Python 3.11+ (inferred from `str | None` union syntax and `list[T]` generics)

### Framework & Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | >=0.111.0 | Web framework, routing, dependency injection |
| uvicorn[standard] | >=0.29.0 | ASGI server |
| supabase | >=2.4.0 | Supabase Python client (auth + PostgREST) |
| pydantic-settings | >=2.2.0 | Settings management from .env |
| python-jose[cryptography] | >=3.3.0 | JWT decoding (HS256/ES256) |
| python-dotenv | >=1.0.0 | .env file loading |
| email-validator | >=2.3.0 | EmailStr validation in Pydantic |

### External Services
- Supabase — managed PostgreSQL + Auth (JWT-based)
- Supabase Auth Admin API — used for user creation by admin

### Environment Variables (backend/.env)
```
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_KEY=<your-supabase-service-role-key>
SUPABASE_JWT_SECRET=<your-supabase-jwt-secret>
APP_ENV=development
```

## Frontend

### Language & Runtime
- JavaScript (ES Modules), React 19

### Framework & Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.5 | UI library |
| react-dom | ^19.2.5 | DOM rendering |
| react-router-dom | ^7.14.2 | Client-side routing |
| axios | ^1.15.2 | HTTP client |
| tailwindcss | ^4.2.4 | Utility-first CSS (via Vite plugin) |
| vite | ^8.0.10 | Build tool and dev server |
| @vitejs/plugin-react | ^6.0.1 | React Fast Refresh |
| @tailwindcss/vite | ^4.2.4 | Tailwind v4 Vite integration |

### Environment Variables (frontend)
```
VITE_API_URL=http://localhost:8000   # Backend base URL
```

## Infrastructure & Deployment

### Docker
- `backend/Dockerfile` — containerizes FastAPI app
- `frontend/Dockerfile` — containerizes Vite/React app
- `docker-compose.yml` — local orchestration, backend on :8000, frontend on :5173

### Frontend Deployment
- `vercel.json` present — frontend deployable to Vercel
- Vite server configured with `host: '0.0.0.0'` for container compatibility

### Database
- Supabase (hosted PostgreSQL)
- Schema defined in `backend/supabase_schema.sql` — run manually in Supabase SQL Editor

## Development Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run dev server (from backend/)
uvicorn app.main:app --reload --port 8000

# API docs (development only)
http://localhost:8000/docs
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev          # http://localhost:5173

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

### Docker (full stack)
```bash
# From project root
docker-compose up --build
```

## Code Quality
- ESLint configured via `eslint.config.js` with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- No backend linter configured (no pyproject.toml / .flake8 / ruff.toml found)
- No test framework configured in either backend or frontend
