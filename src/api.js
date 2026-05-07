import axios from 'axios'

const api = axios.create({
  // Use Vercel environment variable or fallback to empty for local proxy
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' }
})

export const urlApi = {
  // FIX: JSON.stringify ensures the string is sent in a format C# [FromBody] understands
  create: (longUrl) => api.post('/api/URLs/shorten', JSON.stringify(longUrl)).then(r => r.data),

  getAll: (page = 1, pageSize = 20) =>
    api.get(`/api/URLs?page=${page}&pageSize=${pageSize}`).then(r => r.data),
    
  getById: (id) => api.get(`/api/URLs/${id}`).then(r => r.data),
  
  update: (id, data) => api.put(`/api/URLs/${id}`, data).then(r => r.data),
  
  delete: (id) => api.delete(`/api/URLs/${id}`),
}