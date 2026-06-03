import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllConsultations } from '../../api/consultations'
import { getSummary } from '../../api/reports'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLOR = {
  registrado: 'bg-gray-100 text-gray-800',
  derivado: 'bg-purple-100 text-purple-800',
  en_revision: 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [consultas, setConsultas] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    getAllConsultations().then((r) => setConsultas(r.data))
    getSummary(null, null).then((r) => setSummary(r.data))
  }, [])

  const total = consultas.length
  const pendientes = consultas.filter((c) => c.status === 'registrado').length
  const en_proceso = consultas.filter((c) => c.status === 'derivado' || c.status === 'en_revision').length
  const resueltas = consultas.filter((c) => c.status === 'resuelto').length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="text-sm font-semibold text-gray-600">Universidad San Martin de Porres</span>
          <h1 className="text-lg font-bold text-blue-700">Panel Administrativo</h1>
        </div>
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

        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Consultas por mes</h3>
          {summary && Object.keys(summary.by_month).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(summary.by_month).map(([month, count]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20">{month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${(count / Math.max(...Object.values(summary.by_month))) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Sin datos disponibles.</p>
          )}
        </div>

        {summary && summary.avg_resolution_days !== null && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tiempo promedio de resolución</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.avg_resolution_days} <span className="text-sm font-normal text-gray-500">días</span></p>
          </div>
        )}

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
