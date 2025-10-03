import api from './api'

export const collaborationAPI = {
  createInvestigation: async (data) => {
    const response = await api.post('/collaboration/investigations', data)
    return response.data
  },
  
  getInvestigations: async () => {
    const response = await api.get('/collaboration/investigations')
    return response.data
  },
  
  getInvestigation: async (investigationId) => {
    const response = await api.get(`/collaboration/investigations/${investigationId}`)
    return response.data
  },
  
  joinInvestigation: async (investigationId) => {
    const response = await api.post(`/collaboration/investigations/${investigationId}/join`)
    return response.data
  },
  
  shareQueryResult: async (investigationId, queryData) => {
    const response = await api.post(`/collaboration/investigations/${investigationId}/share-query`, queryData)
    return response.data
  }
}