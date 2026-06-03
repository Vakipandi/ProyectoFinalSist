import api from './client'

export const getServices = (category) =>
  api.get('/catalog', { params: { category } })
export const getService = (id) => api.get(`/catalog/${id}`)
export const createService = (data) => api.post('/catalog', data)
export const updateService = (id, data) => api.put(`/catalog/${id}`, data)
export const deleteService = (id) => api.delete(`/catalog/${id}`)
