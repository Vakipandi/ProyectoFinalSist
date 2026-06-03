# Project Structure

## Directory Layout

```
proyectofinalsistema/
├── backend/                        # FastAPI Python backend
│   ├── app/
│   │   ├── routers/                # HTTP route handlers (thin controllers)
│   │   │   ├── auth.py             # /auth endpoints
│   │   │   ├── consultation.py     # /consultations endpoints
│   │   │   ├── kms.py              # /kms endpoints
│   │   │   └── reports.py          # /reports endpoints
│   │   ├── schemas/                # Pydantic request/response models
│   │   │   ├── auth.py
│   │   │   ├── consultation.py
│   │   │   ├── kms.py
│   │   │   └── reports.py
│   │   ├── services/               # Business logic layer
│   │   │   ├── auth.py
│   │   │   ├── consultation.py
│   │   │   ├── kms.py
│   │   │   └── reports.py
│   │   ├── config.py               # Pydantic settings (reads .env)
│   │   ├── database.py             # Supabase client factory
│   │   ├── dependencies.py         # FastAPI dependency injection (auth/RBAC)
│   │   └── main.py                 # App factory, middleware, router registration
│   ├── .env                        # Environment variables (not committed)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── supabase_schema.sql         # Full DB schema for Supabase
│
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── api/                    # Axios API call modules (one per domain)
│   │   │   ├── client.js           # Axios instance + auth interceptor
│   │   │   ├── auth.js
│   │   │   ├── consultations.js
│   │   │   ├── kms.js
│   │   │   └── reports.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state (user, login, logout)
│   │   ├── pages/
│   │   │   ├── alumno/             # Student-facing pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── NuevaConsulta.jsx
│   │   │   │   └── MisConsultas.jsx
│   │   │   ├── admin/              # Staff/admin pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── GestionConsultas.jsx
│   │   │   │   ├── KmsPage.jsx
│   │   │   │   ├── Reportes.jsx
│   │   │   │   └── RegistrarUsuario.jsx
│   │   │   └── shared/
│   │   │       └── LoginPage.jsx
│   │   ├── components/             # Reusable UI components (currently empty)
│   │   ├── hooks/                  # Custom React hooks (currently empty)
│   │   ├── utils/                  # Utility functions (currently empty)
│   │   ├── App.jsx                 # Router setup + ProtectedRoute
│   │   └── main.jsx                # React entry point
│   ├── vite.config.js
│   ├── package.json
│   ├── Dockerfile
│   └── vercel.json                 # Vercel deployment config
│
├── docker-compose.yml              # Local dev orchestration
└── .gitignore
```

## Core Components and Relationships

### Backend Architecture (3-Layer)
```
Router → Service → Database (Supabase)
```
- Routers are thin: validate input via Pydantic schemas, delegate to services, return typed responses
- Services contain all business logic: priority inference, code generation, status transitions
- Database layer is a simple factory function returning a Supabase client

### Frontend Architecture
```
App.jsx (Router + ProtectedRoute)
  └── AuthContext (global state)
  └── Pages
        └── api/ modules (Axios calls)
```
- AuthContext provides `user`, `loading`, `login`, `logout` to the entire tree
- ProtectedRoute guards routes by role using `useAuth()`
- Each page imports directly from the relevant `api/` module — no global state store

### Authentication Flow
1. User POSTs credentials to `/auth/login`
2. Backend calls Supabase Auth, retrieves JWT
3. JWT stored in `localStorage` on the client
4. Axios interceptor attaches `Authorization: Bearer <token>` to every request
5. Backend `get_current_user` dependency decodes JWT and fetches user from `users` table
6. `require_role(*roles)` wraps `get_current_user` for RBAC enforcement

### Database Schema (Supabase / PostgreSQL)
- `users` — id (uuid), email, full_name, role, student_code, is_active
- `consultations` — id, code (CON-XXXXXXXX), user_id, category, title, description, priority, status, assigned_to, response
- `status_history` — audit log of every status change with actor and comment
- `kms_articles` — id, title, content, category, keywords (text[]), view_count, is_published

## Architectural Patterns
- Role-Based Access Control (RBAC) via FastAPI dependency injection
- Keyword-based priority inference at consultation creation time (no ML)
- KMS article promotion: resolved consultations can be directly published as KMS articles
- Optimistic UI updates: after mutations, local state is updated without full refetch
- Debounced KMS search (600ms) triggered by form input changes
