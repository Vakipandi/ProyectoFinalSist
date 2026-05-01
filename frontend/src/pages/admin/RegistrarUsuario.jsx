import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../../api/auth'

export default function RegistrarUsuario() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'alumno', student_code: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const data = { ...form }
      if (data.role === 'alumno') {
        if (data.student_code.length !== 8 || !/^\d+$/.test(data.student_code)) {
          setError('El código de alumno debe tener exactamente 8 dígitos')
          setLoading(false)
          return
        }
        delete data.password
      }
      if (!data.student_code) delete data.student_code
      await register(data)
      setSuccess(`Usuario ${form.email} creado. Contraseña: ${form.role === 'alumno' ? form.student_code : '(la ingresada)'}`)
      setForm({ email: '', password: '', full_name: '', role: 'alumno', student_code: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h1 className="text-lg font-bold text-blue-700">Registrar Usuario</h1>
      </nav>

      <div className="max-w-md mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input required type="text" value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="usuario@universidad.pe" />
            </div>

            {form.role !== 'alumno' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input required type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="alumno">Alumno</option>
                <option value="secretaria">Secretaria</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {form.role === 'alumno' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código de alumno <span className="text-gray-400 text-xs">(8 dígitos — será la contraseña)</span></label>
                <input required type="text" value={form.student_code} maxLength={8}
                  onChange={(e) => setForm({ ...form, student_code: e.target.value.replace(/\D/g, '') })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20210001" />
                {form.student_code && form.student_code.length !== 8 && (
                  <p className="text-xs text-red-500 mt-1">{form.student_code.length}/8 dígitos</p>
                )}
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50">
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
