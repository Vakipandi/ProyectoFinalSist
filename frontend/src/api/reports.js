import api from './client'

export const getSummary = (date_from, date_to) =>
  api.get('/reports/summary', { params: { date_from, date_to } })
