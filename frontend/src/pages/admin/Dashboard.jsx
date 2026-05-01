import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllConsultations } from '../../api/consultations'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLOR = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [consultas, setConsultas] = useState([])

  useEffect(() => {
    getAllConsultations().then((r) => setConsultas(r.data))
  }, [])

  const total = consultas.length
  const pendientes = consultas.filter((c) => c.status === 'pendiente').length
  const en_proceso = consultas.filter((c) => c.status === 'en_proceso').length
  const resueltas = consultas.filter((c) => c.status === 'resuelto').length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-700">Panel Administrativo</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.full_name} · {user?.role}</span>
          <button onClick={() => { logout(); navigate('/login') }} className="text-sm text-red-500 hover:underline">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumen general</h2>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: total, color: 'text-gray-800' },
            { label: 'Pendientes', value: pendientes, color: 'text-yellow-500' },
            { label: 'En proceso', value: en_proceso, color: 'text-blue-500' },
            { label: 'Resueltas', value: resueltas, color: 'text-green-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link to="/admin/consultas" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition text-center">
            Gestionar consultas
          </Link>
          <Link to="/admin/reportes" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg text-sm font-medium transition text-center">
            Ver reportes
          </Link>
          <Link to="/admin/kms" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg text-sm font-medium transition text-center">
            Base de conocimientos
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/usuarios" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg text-sm font-medium transition text-center">
              Registrar usuario
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Últimas consultas</h3>
          {consultas.length === 0 ? (
            <p className="text-sm text-gray-400">No hay consultas aún.</p>
          ) : (
            <div className="space-y-3">
              {consultas.slice(0, 5).map((c) => (
                <div key={c.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.code} · {c.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[c.status]}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
