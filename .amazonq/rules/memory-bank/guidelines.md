# Development Guidelines

## Code Quality Standards

### Python (Backend)
- All `__init__.py` files are intentionally empty — packages are namespace-only, no re-exports
- Use Python 3.10+ union syntax: `str | None` instead of `Optional[str]`
- Use built-in generic types: `list[str]`, `dict[str, int]` instead of `List`, `Dict` from typing
- Import only what is used — no wildcard imports anywhere in the codebase
- Private helper functions prefixed with `_` (e.g., `_infer_priority`, `_generate_code`)
- No type annotations on function bodies — only on function signatures and Pydantic models

### JavaScript/JSX (Frontend)
- ES Module syntax throughout (`import`/`export`), no CommonJS
- Default exports for page components, named exports for context hooks and API functions
- No TypeScript — plain `.js` for API modules, `.jsx` for React components
- Minimal comments — code is self-documenting through clear naming

---

## Naming Conventions

### Backend
| Element | Convention | Example |
|---------|-----------|---------|
| Files | snake_case | `consultation.py` |
| Functions | snake_case | `create_consultation`, `get_by_code` |
| Classes (Pydantic) | PascalCase | `ConsultationCreate`, `LoginResponse` |
| Variables | snake_case | `user_id`, `old_status` |
| Constants | UPPER_SNAKE_CASE | `KEYWORDS_ALTA`, `KEYWORDS_MEDIA` |
| Private helpers | `_snake_case` | `_infer_priority()` |

### Frontend
| Element | Convention | Example |
|---------|-----------|---------|
| Files (components) | PascalCase | `NuevaConsulta.jsx`, `AuthContext.jsx` |
| Files (api/utils) | camelCase | `client.js`, `consultations.js` |
| Components | PascalCase | `ProtectedRoute`, `AppRoutes` |
| Functions/handlers | camelCase | `handleSubmit`, `handleStatusUpdate` |
| State variables | camelCase | `consultas`, `newStatus`, `kmsSuccess` |
| Constants (maps) | UPPER_SNAKE_CASE | `STATUS_COLOR`, `PRIORITY_COLOR` |

---

## Backend Patterns

### Router Pattern (thin controllers)
Routers only wire HTTP → service. No business logic in routers.
```python
from fastapi import APIRouter, Depends
from app.schemas.consultation import ConsultationCreate, ConsultationResponse
from app.services import consultation as consultation_service
from app.dependencies import require_role

router = APIRouter(prefix="/consultations", tags=["consultations"])

@router.post("", response_model=ConsultationResponse)
def create(data: ConsultationCreate, current_user=Depends(require_role("alumno"))):
    return consultation_service.create_consultation(data, current_user["id"])
```

### Service Pattern (all business logic here)
Services receive plain data, call `get_supabase()` internally, raise `HTTPException` on errors.
```python
from fastapi import HTTPException, status
from app.database import get_supabase

def get_by_code(code: str) -> dict:
    db = get_supabase()
    result = db.table("consultations").select("*").eq("code", code).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consulta no encontrada")
    return result.data[0]
```

### Dependency Injection for RBAC
Use `require_role(*roles)` for protected endpoints, `get_current_user` for auth-only.
```python
# Auth only (any authenticated user)
@router.get("/{code}", response_model=ConsultationResponse)
def get_by_code(code: str, _=Depends(get_current_user)):
    ...

# Role-restricted
@router.post("/register", response_model=UserResponse)
def register(data: RegisterRequest, _=Depends(require_role("admin"))):
    ...

# Current user needed in handler
@router.post("", response_model=ConsultationResponse)
def create(data: ConsultationCreate, current_user=Depends(require_role("alumno"))):
    return service.create(data, current_user["id"])
```

### Pydantic Schema Pattern
- Separate `Create`, `Update`, and `Response` models per domain
- Use `Literal` for constrained string fields (enums)
- Response models are flat dicts — no nested model validation (Supabase returns dicts)
```python
from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class ConsultationCreate(BaseModel):
    category: Literal["academico", "financiero", "infraestructura", "sistemas"]
    title: str
    description: str

class ConsultationResponse(BaseModel):
    id: str
    code: str
    status: str
    created_at: datetime
```

### Supabase Query Pattern
Always call `get_supabase()` at the start of each service function (no shared client state).
```python
def get_articles(category: str | None = None) -> list:
    db = get_supabase()
    query = db.table("kms_articles").select("*").eq("is_published", True)
    if category:
        query = query.eq("category", category)
    return query.order("view_count", desc=True).execute().data
```

### Error Handling
Raise `HTTPException` with `status.HTTP_*` constants. Error messages are in Spanish.
```python
raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consulta no encontrada")
raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El código de alumno debe tener exactamente 8 dígitos")
```

---

## Frontend Patterns

### API Module Pattern
One file per domain in `src/api/`. All functions are one-liners using the shared `api` client.
```js
// src/api/consultations.js
import api from './client'

export const createConsultation = (data) => api.post('/consultations', data)
export const getMyConsultations = () => api.get('/consultations/me')
export const updateStatus = (code, status, comment) =>
  api.patch(`/consultations/${code}/status`, { status, comment })
```

### Axios Client with Auth Interceptor
Token is read from `localStorage` on every request via interceptor.
```js
// src/api/client.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### AuthContext Pattern
Global auth state via React Context. Always consume with `useAuth()` hook.
```jsx
// Providing
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // ...
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Consuming
export const useAuth = () => useContext(AuthContext)
const { user, loading, login, logout } = useAuth()
```

### ProtectedRoute Pattern
Role-based route guarding inline in App.jsx.
```jsx
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />
  return children
}

// Usage
<Route path="/admin/usuarios" element={
  <ProtectedRoute roles={['admin']}><RegistrarUsuario /></ProtectedRoute>
} />
```

### Page Component State Pattern
Pages manage their own local state. Pattern: `[data, setData]`, `[loading, setLoading]`, `[error, setError]`.
```jsx
const [form, setForm] = useState({ category: 'academico', title: '', description: '' })
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)
  setError('')
  try {
    await createConsultation(form)
    navigate('/alumno/consultas')
  } catch {
    setError('Error al enviar la consulta')
  } finally {
    setLoading(false)
  }
}
```

### Optimistic Local State Update
After mutations, update local list state without refetching.
```jsx
const updated = await updateStatus(selected.code, newStatus, comment)
setConsultas((prev) => prev.map((c) => c.id === updated.data.id ? updated.data : c))
```

### Debounced Side Effect Pattern
Use `useRef` for debounce timers inside `useEffect`.
```jsx
const debounceRef = useRef(null)

useEffect(() => {
  clearTimeout(debounceRef.current)
  debounceRef.current = setTimeout(async () => {
    const res = await searchArticles(text)
    setSuggestions(res.data.slice(0, 3))
  }, 600)
  return () => clearTimeout(debounceRef.current)
}, [form.title, form.description])
```

---

## Styling Conventions (Tailwind CSS v4)

- All styling via Tailwind utility classes — no custom CSS files except `index.css` / `App.css` for globals
- Card pattern: `bg-white rounded-xl shadow-sm p-4` or `p-5` or `p-6`
- Page layout: `min-h-screen bg-gray-50` wrapper with `max-w-*xl mx-auto px-6 py-8`
- Nav bar: `bg-white shadow-sm px-6 py-4 flex items-center gap-4`
- Primary button: `bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50`
- Input/select: `w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`
- Status badge: `text-xs px-2 py-1 rounded-full font-medium` + color map constant
- Color maps defined as module-level constants:
```jsx
const STATUS_COLOR = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
}
```

---

## Domain Constants

### Roles
`alumno` | `secretaria` | `admin`

### Consultation Categories
`academico` | `financiero` | `infraestructura` | `sistemas`

### Consultation Priority (auto-inferred)
`alta` | `media` | `baja` — inferred from title+description keywords at creation time, never set by user

### Consultation Status
`pendiente` → `en_proceso` → `resuelto`

### Consultation Code Format
`CON-` + 8 random uppercase alphanumeric characters (e.g., `CON-A3BX9KZ1`)

---

## Security Notes
- JWT signature verification is currently disabled (`"verify_signature": False`) — tokens are decoded but not cryptographically verified. This is a known limitation.
- CORS is set to `allow_origins=["*"]` — restrict in production
- API docs (`/docs`) are disabled when `APP_ENV=production`
- Student default password equals their 8-digit student code — enforce password change in production
