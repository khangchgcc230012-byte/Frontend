// Import axios library for making HTTP requests
import axios from 'axios'

// Create an axios instance with default configuration for API calls
const api = axios.create({
  // Use environment variable for base URL, fallback to empty string if not set
  baseURL: import.meta.env.VITE_API_URL || '',
  // Set Content-Type header for all requests
  headers: { 'Content-Type': 'application/json' }
})

// Export URL API methods for CRUD operations on shortened URLs
export const urlApi = {
  // Create a new shortened URL by sending the long URL to the backend
  // POST /api/URLs/shorten endpoint
  create: (longUrl) => api.post('/api/URLs/shorten', JSON.stringify(longUrl)).then(r => r.data),

  // Fetch all URLs with pagination support
  // GET /api/URLs endpoint with page and pageSize parameters
  getAll: (page = 1, pageSize = 20) =>
    api.get(`/api/URLs?page=${page}&pageSize=${pageSize}`).then(r => r.data),
  
  // Fetch a specific URL by its ID
  // GET /api/URLs/{id} endpoint
  getById: (id) => api.get(`/api/URLs/${id}`).then(r => r.data),
  
  // Update a URL record by ID
  // PUT /api/URLs/{id} endpoint with updated data
  update: (id, data) => api.put(`/api/URLs/${id}`, data).then(r => r.data),
  
  // Delete a URL record by ID
  // DELETE /api/URLs/{id} endpoint
  delete: (id) => api.delete(`/api/URLs/${id}`),
}