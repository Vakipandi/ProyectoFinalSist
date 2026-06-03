import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyConsultations } from '../../api/consultations'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLOR = {
  registrado: 'bg-gray-100 text-gray-800',
  derivado: 'bg-purple-100 text-purple-800',
  en_revision: 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
}

export default function AlumnoDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [consultas, setConsultas] = useState([])

  useEffect(() => {
    getMyConsultations().then((r) => setConsultas(r.data))
  }, [])

  const total = consultas.length
  const pendientes = consultas.filter((c) => c.status === 'registrado' || c.status === 'derivado').length
  const resueltas = consultas.filter((c) => c.status === 'resuelto').length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="text-sm font-semibold text-gray-600">Universidad San Martin de Porres</span>
          <h1 className="text-lg font-bold text-blue-700">Sistema de Consultas</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.full_name}</span>
          <button onClick={() => { logout(); navigate('/login') }} className="text-sm text-red-500 hover:underline">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Bienvenido, {user?.full_name}</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-gray-800">{total}</p>
            <p className="text-sm text-gray-500 mt-1">Total consultas</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-yellow-500">{pendientes}</p>
            <p className="text-sm text-gray-500 mt-1">Pendientes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-green-500">{resueltas}</p>
            <p className="text-sm text-gray-500 mt-1">Resueltas</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Link to="/alumno/nueva" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            + Nueva consulta
          </Link>
          <Link to="/alumno/catalogo" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition">
            Catálogo de servicios
          </Link>
          <Link to="/alumno/consultas" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition">
            Ver mis consultas
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Últimas consultas</h3>
          {consultas.length === 0 ? (
            <p className="text-sm text-gray-400">No tienes consultas aún.</p>
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
