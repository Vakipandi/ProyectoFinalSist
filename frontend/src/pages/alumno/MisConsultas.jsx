import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyConsultations, getHistory } from '../../api/consultations'

const STATUS_COLOR = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
}

const PRIORITY_COLOR = {
  alta: 'text-red-600',
  media: 'text-yellow-600',
  baja: 'text-green-600',
}

export default function MisConsultas() {
  const [consultas, setConsultas] = useState([])
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    getMyConsultations().then((r) => setConsultas(r.data))
  }, [])

  async function handleSelect(c) {
    setSelected(c)
    const res = await getHistory(c.code)
    setHistory(res.data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/alumno" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h1 className="text-lg font-bold text-blue-700">Mis Consultas</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {consultas.length === 0 && (
            <p className="text-sm text-gray-400">No tienes consultas aún.</p>
          )}
          {consultas.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition border-2 ${selected?.id === c.id ? 'border-blue-500' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium text-gray-800">{c.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[c.status]}`}>
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">{c.code} · {c.category} · <span className={PRIORITY_COLOR[c.priority]}>{c.priority}</span></p>
            </div>
          ))}
        </div>

        {selected && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-1">{selected.title}</h3>
            <p className="text-xs text-gray-400 mb-3">{selected.code}</p>
            <p className="text-sm text-gray-600 mb-4">{selected.description}</p>

            {selected.response && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-green-700 mb-1">Respuesta:</p>
                <p className="text-sm text-green-800">{selected.response}</p>
              </div>
            )}

            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Historial</h4>
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="text-xs text-gray-500 border-l-2 border-blue-200 pl-3">
                  <span className="font-medium text-gray-700">{h.new_status}</span>
                  {h.comment && <span> — {h.comment}</span>}
                  <p className="text-gray-400">{new Date(h.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
