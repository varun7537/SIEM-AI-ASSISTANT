import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred'
    
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: message
    })
    
    return Promise.reject({
      ...error,
      message: message
    })
  }
)

// Chat API methods
export const chatAPI = {
  sendMessage: async (message, sessionId, userId = null) => {
    const response = await api.post('/chat/query', {
      message,
      session_id: sessionId,
      user_id: userId
    })
    return response.data
  },
  
  getChatHistory: async (sessionId, limit = 20) => {
    const response = await api.get(`/chat/history/${sessionId}?limit=${limit}`)
    return response.data
  },
  
  updateContext: async (sessionId, contextUpdates) => {
    const response = await api.post(`/chat/context/${sessionId}`, contextUpdates)
    return response.data
  },
  
  clearSession: async (sessionId) => {
    const response = await api.delete(`/chat/session/${sessionId}`)
    return response.data
  }
}

// Reports API methods
export const reportsAPI = {
  generateReport: async (description, reportType = 'summary') => {
    const response = await api.post('/reports/generate', {
      description,
      report_type: reportType,
      include_charts: true
    })
    return response.data
  },
  
  getReportTemplates: async () => {
    const response = await api.get('/reports/templates')
    return response.data
  }
}

// Health API methods
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health')
    return response.data
  },
  
  detailedHealthCheck: async () => {
    const response = await api.get('/health/detailed')
    return response.data
  }
}

export default api