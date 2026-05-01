import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSummary } from '../../api/reports'

export default function Reportes() {
  const [summary, setSummary] = useState(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    fetchSummary()
  }, [])

  async function fetchSummary() {
    const res = await getSummary(dateFrom || null, dateTo || null)
    setSummary(res.data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h1 className="text-lg font-bold text-blue-700">Reportes</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrar por fecha</h3>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desde</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hasta</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <button onClick={fetchSummary}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
              Aplicar
            </button>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-4xl font-bold text-gray-800 mb-1">{summary.total}</p>
              <p className="text-sm text-gray-500">Total consultas</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Por estado</h3>
              {Object.entries(summary.by_status).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Por categoría</h3>
              {Object.entries(summary.by_category).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Por prioridad</h3>
              {Object.entries(summary.by_priority).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
