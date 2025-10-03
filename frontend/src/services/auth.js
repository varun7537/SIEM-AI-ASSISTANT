import api from './api'

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },
  
  signup: async (email, username, full_name, password) => {
    const response = await api.post('/auth/signup', {
      email,
      username,
      full_name,
      password
    })
    return response.data
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}

export default authAPI