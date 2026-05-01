import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LoginPage from './pages/shared/LoginPage'
import AlumnoDashboard from './pages/alumno/Dashboard'
import NuevaConsulta from './pages/alumno/NuevaConsulta'
import MisConsultas from './pages/alumno/MisConsultas'
import AdminDashboard from './pages/admin/Dashboard'
import GestionConsultas from './pages/admin/GestionConsultas'
import Reportes from './pages/admin/Reportes'
import KmsPage from './pages/admin/KmsPage'
import RegistrarUsuario from './pages/admin/RegistrarUsuario'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        user?.role === 'alumno'
          ? <Navigate to="/alumno" />
          : <Navigate to="/admin" />
      } />

      <Route path="/alumno" element={<ProtectedRoute roles={['alumno']}><AlumnoDashboard /></ProtectedRoute>} />
      <Route path="/alumno/nueva" element={<ProtectedRoute roles={['alumno']}><NuevaConsulta /></ProtectedRoute>} />
      <Route path="/alumno/consultas" element={<ProtectedRoute roles={['alumno']}><MisConsultas /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute roles={['secretaria', 'admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/consultas" element={<ProtectedRoute roles={['secretaria', 'admin']}><GestionConsultas /></ProtectedRoute>} />
      <Route path="/admin/reportes" element={<ProtectedRoute roles={['secretaria', 'admin']}><Reportes /></ProtectedRoute>} />
      <Route path="/admin/kms" element={<ProtectedRoute roles={['secretaria', 'admin']}><KmsPage /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute roles={['admin']}><RegistrarUsuario /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
