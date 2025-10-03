import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      ...error,
      message
    });
  }
);

// Authentication API
export const authAPI = {
  // Login user and return response data
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Sign up new user
  signup: async (email, username, full_name, password) => {
    try {
      const response = await api.post('/auth/signup', { email, username, full_name, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user and clear local storage
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },
  
  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// AI Analysis API
export const aiAnalysisAPI = {
  // Analyze threats with query request
  analyzeThreats: async (queryRequest) => {
    try {
      const response = await api.post('/ai-analysis/analyze-threats', queryRequest);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get threat dashboard data
  getThreatDashboard: async () => {
    try {
      const response = await api.get('/ai-analysis/threat-dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Collaboration API
export const collaborationAPI = {
  // Create a new investigation
  createInvestigation: async (data) => {
    try {
      const response = await api.post('/collaboration/investigations', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all investigations
  getInvestigations: async () => {
    try {
      const response = await api.get('/collaboration/investigations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get specific investigation by ID
  getInvestigation: async (investigationId) => {
    try {
      const response = await api.get(`/collaboration/investigations/${investigationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Join an investigation
  joinInvestigation: async (investigationId) => {
    try {
      const response = await api.post(`/collaboration/investigations/${investigationId}/join`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Share query result in an investigation
  shareQueryResult: async (investigationId, queryData) => {
    try {
      const response = await api.post(`/collaboration/investigations/${investigationId}/share-query`, queryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Chat API
export const chatAPI = {
  // Send a chat message
  sendMessage: async (message, sessionId, userId = null) => {
    try {
      const response = await api.post('/chat/query', {
        message,
        session_id: sessionId,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get chat history for a session
  getChatHistory: async (sessionId, limit = 20) => {
    try {
      const response = await api.get(`/chat/history/${sessionId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update chat context
  updateContext: async (sessionId, contextUpdates) => {
    try {
      const response = await api.post(`/chat/context/${sessionId}`, contextUpdates);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Clear chat session
  clearSession: async (sessionId) => {
    try {
      const response = await api.delete(`/chat/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Reports API
export const reportsAPI = {
  // Generate a report
  generateReport: async (description, reportType = 'summary') => {
    try {
      const response = await api.post('/reports/generate', {
        description,
        report_type: reportType,
        include_charts: true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get available report templates
  getReportTemplates: async () => {
    try {
      const response = await api.get('/reports/templates');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Health API
export const healthAPI = {
  // Check basic health status
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Perform detailed health check
  detailedHealthCheck: async () => {
    try {
      const response = await api.get('/health/detailed');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Admin API
export const adminAPI = {
  // Get list of users
  getUserList: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a user by ID
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;