import api from './client'

export const createConsultation = (data) => api.post('/consultations', data)
export const getMyConsultations = () => api.get('/consultations/me')
export const getAllConsultations = () => api.get('/consultations')
export const getByCode = (code) => api.get(`/consultations/${code}`)
export const updateStatus = (code, status, comment) =>
  api.patch(`/consultations/${code}/status`, { status, comment })
export const updateResponse = (code, response) =>
  api.patch(`/consultations/${code}/response`, { response })
export const getHistory = (code) => api.get(`/consultations/${code}/history`)
