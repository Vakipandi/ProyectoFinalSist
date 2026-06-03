import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSummary } from '../../api/reports'

const STATUS_LABELS = { registrado: 'Registrado', derivado: 'Derivado', en_revision: 'En revisión', resuelto: 'Resuelto' }
const CATEGORY_LABELS = { academico: 'Académico', financiero: 'Financiero', infraestructura: 'Infraestructura', sistemas: 'Sistemas', matricula: 'Matrícula', tramites: 'Trámites' }
const PRIORITY_LABELS = { alta: 'Alta', media: 'Media', baja: 'Baja' }

const BAR_COLORS = {
  registrado: 'bg-gray-400',
  derivado: 'bg-purple-500',
  en_revision: 'bg-blue-500',
  resuelto: 'bg-green-500',
  alta: 'bg-red-500',
  media: 'bg-yellow-500',
  baja: 'bg-green-400',
}

function BarChart({ data, labels, colorMap }) {
  const max = Math.max(...Object.values(data), 1)
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-28 truncate">{labels?.[key] ?? key}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${colorMap?.[key] || 'bg-blue-500'}`}
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-700 w-8 text-right">{value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Reportes() {
  const [summary, setSummary] = useState(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSummary()
  }, [])

  async function fetchSummary() {
    setLoading(true)
    try {
      const res = await getSummary(dateFrom || null, dateTo || null)
      setSummary(res.data)
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
        <h1 className="text-lg font-bold text-blue-700">Reportes</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
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
            <button onClick={fetchSummary} disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-50">
              {loading ? 'Cargando...' : 'Aplicar'}
            </button>
          </div>
        </div>

        {summary && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-gray-800">{summary.total}</p>
                <p className="text-sm text-gray-500 mt-1">Total consultas</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-green-600">{summary.by_status?.resuelto || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Resueltas</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-blue-600">{summary.by_status?.en_revision || 0}</p>
                <p className="text-sm text-gray-500 mt-1">En revisión</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-gray-800">
                  {summary.avg_resolution_days !== null ? `${summary.avg_resolution_days}d` : '—'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Tiempo prom. resolución</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Por estado</h3>
                <BarChart data={summary.by_status} labels={STATUS_LABELS} colorMap={BAR_COLORS} />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Por categoría</h3>
                <BarChart data={summary.by_category} labels={CATEGORY_LABELS} />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Por prioridad</h3>
                <BarChart data={summary.by_priority} labels={PRIORITY_LABELS} colorMap={BAR_COLORS} />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Por mes</h3>
                {Object.keys(summary.by_month).length > 0 ? (
                  <BarChart data={summary.by_month} />
                ) : (
                  <p className="text-sm text-gray-400">Sin datos de meses disponibles.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
