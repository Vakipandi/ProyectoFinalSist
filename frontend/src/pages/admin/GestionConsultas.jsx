import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllConsultations, updateStatus, updateResponse, getHistory } from '../../api/consultations'
import { createArticle } from '../../api/kms'

const STATUS_COLOR = {
  registrado: 'bg-gray-100 text-gray-800',
  derivado: 'bg-purple-100 text-purple-800',
  en_revision: 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
}

const PRIORITY_COLOR = {
  alta: 'text-red-600 font-semibold',
  media: 'text-yellow-600',
  baja: 'text-green-600',
}

export default function GestionConsultas() {
  const [consultas, setConsultas] = useState([])
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])
  const [newStatus, setNewStatus] = useState('')
  const [comment, setComment] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('todos')
  const [kmsSuccess, setKmsSuccess] = useState(false)

  useEffect(() => {
    getAllConsultations().then((r) => setConsultas(r.data))
  }, [])

  async function handleSelect(c) {
    setSelected(c)
    setNewStatus(c.status)
    setResponse(c.response || '')
    setComment('')
    const res = await getHistory(c.code)
    setHistory(res.data)
  }

  async function handleStatusUpdate() {
    setLoading(true)
    try {
      const updated = await updateStatus(selected.code, newStatus, comment)
      setSelected(updated.data)
      setConsultas((prev) => prev.map((c) => c.id === updated.data.id ? updated.data : c))
      const res = await getHistory(selected.code)
      setHistory(res.data)
      setComment('')
    } finally {
      setLoading(false)
    }
  }

  async function handleResponse() {
    setLoading(true)
    try {
      const updated = await updateResponse(selected.code, response)
      setSelected(updated.data)
      setConsultas((prev) => prev.map((c) => c.id === updated.data.id ? updated.data : c))
      const res = await getHistory(selected.code)
      setHistory(res.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddToKms() {
    const keywords = selected.title.toLowerCase().split(' ').filter((w) => w.length > 3)
    await createArticle({
      title: selected.title,
      content: selected.response,
      category: selected.category,
      keywords,
    })
    setKmsSuccess(true)
    setTimeout(() => setKmsSuccess(false), 3000)
  }

  const filtered = filter === 'todos' ? consultas : consultas.filter((c) => c.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <span className="text-sm font-semibold text-gray-600">Universidad San Martin de Porres</span>
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h1 className="text-lg font-bold text-blue-700">Gestión de Consultas</h1>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex gap-2 mb-4">
            {['todos', 'registrado', 'derivado', 'en_revision', 'resuelto'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-3 py-1 rounded-full border transition ${filter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && <p className="text-sm text-gray-400">No hay consultas.</p>}
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition border-2 ${
                  selected?.id === c.id ? 'border-blue-500' : c.priority === 'alta' ? 'border-red-200' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-gray-800">{c.title}</p>
                  <div className="flex gap-1">
                    {c.priority === 'alta' && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700">🔴 alta</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[c.status]}`}>{c.status}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{c.code} · {c.category} · <span className={PRIORITY_COLOR[c.priority]}>{c.priority}</span></p>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">{selected.title}</h3>
              <p className="text-xs text-gray-400">{selected.code}</p>
              <p className="text-sm text-gray-600 mt-2">{selected.description}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cambiar estado</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
              >
                <option value="registrado">registrado</option>
                <option value="derivado">derivado</option>
                <option value="en_revision">en_revision</option>
                <option value="resuelto">resuelto</option>
              </select>
              <input
                type="text"
                placeholder="Comentario (opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
              />
              <button
                onClick={handleStatusUpdate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                Actualizar estado
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Responder</label>
              <textarea
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
                placeholder="Escribe la respuesta al alumno..."
              />
              <button
                onClick={handleResponse}
                disabled={loading || !response}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                Enviar respuesta
              </button>
            </div>

            {selected.status === 'resuelto' && selected.response && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">¿Esta respuesta puede ayudar a otros alumnos?</p>
                <button
                  onClick={handleAddToKms}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition"
                >
                  📚 Agregar al KMS
                </button>
                {kmsSuccess && <p className="text-xs text-green-600 mt-2 text-center">✓ Agregado al KMS correctamente</p>}
              </div>
            )}

            <div>
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
          </div>
        )}
      </div>
    </div>
  )
}
