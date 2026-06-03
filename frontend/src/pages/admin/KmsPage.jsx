import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getArticles, createArticle, searchArticles } from '../../api/kms'

const CATEGORIES = ['academico', 'financiero', 'infraestructura', 'sistemas', 'matricula', 'tramites']

export default function KmsPage() {
  const [articles, setArticles] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: 'academico', keywords: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getArticles().then((r) => setArticles(r.data))
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    if (search.length < 2) return
    const res = await searchArticles(search)
    setArticles(res.data)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await createArticle({
        ...form,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      })
      setShowForm(false)
      setForm({ title: '', content: '', category: 'academico', keywords: '' })
      const res = await getArticles()
      setArticles(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <span className="text-sm font-semibold text-gray-600">Universidad San Martin de Porres</span>
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h1 className="text-lg font-bold text-blue-700">Base de Conocimientos</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar artículos..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
              Buscar
            </button>
          </form>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            + Nuevo artículo
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Nuevo artículo</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input required type="text" placeholder="Título" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea required rows={4} placeholder="Contenido del artículo" value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input type="text" placeholder="Keywords separadas por coma: nota, examen, revisión" value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm transition disabled:opacity-50">
                {loading ? 'Guardando...' : 'Guardar artículo'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((a) => (
            <div key={a.id} onClick={() => setSelected(selected?.id === a.id ? null : a)}
              className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition border-2 ${selected?.id === a.id ? 'border-blue-500' : 'border-transparent'}`}>
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium text-gray-800">{a.title}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{a.category}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">👁 {a.view_count} vistas</p>
              {selected?.id === a.id && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600 mb-2">{a.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {(a.keywords || []).map((k) => (
                      <span key={k} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
