import axios from 'axios'

const api = axios.create({
  // This pulls from Vercel Settings in production
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' }
})

export const urlApi = {

  create: (longUrl) => api.post('/api/URLs/shorten', longUrl).then(r => r.data),

  getAll: (page = 1, pageSize = 20) =>
    api.get(`/api/URLs?page=${page}&pageSize=${pageSize}`).then(r => r.data),
    
  getById: (id) => api.get(`/api/URLs/${id}`).then(r => r.data),
  
  update: (id, data) => api.put(`/api/URLs/${id}`, data).then(r => r.data),
  
  delete: (id) => api.delete(`/api/URLs/${id}`),
}