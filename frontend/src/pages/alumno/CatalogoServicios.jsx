import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../../api/catalog'

const CATEGORIES = ['todos', 'academico', 'financiero', 'infraestructura', 'sistemas', 'matricula', 'tramites']

export default function CatalogoServicios() {
  const [services, setServices] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    getServices().then((r) => setServices(r.data))
  }, [])

  const filtered = filter === 'todos' ? services : services.filter((s) => s.category === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <span className="text-sm font-semibold text-gray-600">Universidad San Martin de Porres</span>
        <Link to="/alumno" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h1 className="text-lg font-bold text-blue-700">Catálogo de Servicios</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-sm text-gray-500 mb-6">Consulta los servicios disponibles. Si encuentras lo que necesitas, no hace falta enviar una consulta.</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-xs px-3 py-1 rounded-full border transition ${filter === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)}
              className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition border-2 ${selected?.id === s.id ? 'border-blue-500' : 'border-transparent'}`}>
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{s.category}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">⏱ {s.estimated_time} · 👤 {s.responsible}</p>
              <p className="text-sm text-gray-600">{s.description}</p>

              {selected?.id === s.id && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  {s.requirements && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Requisitos</p>
                      <p className="text-sm text-gray-600">{s.requirements}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Procedimiento</p>
                    <p className="text-sm text-gray-600">{s.procedure}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400">No hay servicios en esta categoría.</p>}
        </div>
      </div>
    </div>
  )
}
