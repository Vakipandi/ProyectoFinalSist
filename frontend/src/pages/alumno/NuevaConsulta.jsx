import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createConsultation } from '../../api/consultations'
import { searchArticles } from '../../api/kms'

const CATEGORIES = ['academico', 'financiero', 'infraestructura', 'sistemas']

export default function NuevaConsulta() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ category: 'academico', title: '', description: '' })
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const debounceRef = useRef(null)

  useEffect(() => {
    const text = `${form.title} ${form.description}`.trim()
    if (text.length < 5) { setSuggestions([]); return }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const res = await searchArticles(text.slice(0, 80))
      setSuggestions(res.data.slice(0, 3))
    }, 600)

    return () => clearTimeout(debounceRef.current)
  }, [form.title, form.description])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/alumno" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h1 className="text-lg font-bold text-blue-700">Nueva Consulta</h1>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {suggestions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-blue-700 mb-3">💡 Encontramos respuestas relacionadas:</p>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={s.id} className={`rounded-lg p-3 ${i === 0 ? 'bg-white border border-blue-300' : 'bg-blue-50'}`}>
                  <p className="text-sm font-semibold text-blue-800 mb-1">{s.title}</p>
                  {i === 0 && (
                    <p className="text-sm text-gray-700 mb-2">{s.content}</p>
                  )}
                  {i !== 0 && (
                    <p className="text-xs text-blue-600">→ {s.category}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Si esto resuelve tu duda, no necesitas enviar una consulta.</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Registrar consulta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resumen breve del problema"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu problema con detalle..."
              />
              <p className="text-xs text-gray-400 mt-1">Las sugerencias se actualizan mientras escribes</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
