import axios from 'axios'

const api = axios.create({
  // This pulls from Vercel Settings in production
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' }
})

export const urlApi = {
  // 1. Path must be /api/URLs/shorten
  // 2. Use JSON.stringify because C# [FromBody] string expects a quoted JSON string
  create: (longUrl) => 
    api.post('/api/URLs/shorten', JSON.stringify(longUrl)).then(r => r.data),

  // 3. Path must be /api/URLs
  getAll: (page = 1, pageSize = 20) =>
    api.get(`/api/URLs?page=${page}&pageSize=${pageSize}`).then(r => r.data),
    
  // 4. Path must be /api/URLs/${id}
  getById: (id) => api.get(`/api/URLs/${id}`).then(r => r.data),
  
  // 5. Use .put to match your [HttpPut] in C#
  update: (id, data) => api.put(`/api/URLs/${id}`, data).then(r => r.data),
  
  delete: (id) => api.delete(`/api/URLs/${id}`),
}