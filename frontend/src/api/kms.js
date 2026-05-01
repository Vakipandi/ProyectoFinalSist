import api from './client'

export const getArticles = (category) =>
  api.get('/kms', { params: { category } })
export const searchArticles = (q) => api.get('/kms/search', { params: { q } })
export const getArticle = (id) => api.get(`/kms/${id}`)
export const createArticle = (data) => api.post('/kms', data)
