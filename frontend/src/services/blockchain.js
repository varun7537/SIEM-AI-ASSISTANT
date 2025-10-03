import api from './api'

export const blockchainAPI = {
  getAuditHistory: async () => {
    const response = await api.get('/blockchain/audit-history')
    return response.data
  },
  
  verifyTransaction: async (txHash) => {
    const response = await api.post('/blockchain/verify', { tx_hash: txHash })
    return response.data
  },
  
  getBlockchainStats: async () => {
    const response = await api.get('/blockchain/stats')
    return response.data
  },
  
  getTransactionHistory: async () => {
    const response = await api.get('/blockchain/transactions')
    return response.data
  },
  
  getTransactionDetails: async (txHash) => {
    const response = await api.get(`/blockchain/transactions/${txHash}`)
    return response.data
  },
  
  getUserWallet: async () => {
    const response = await api.get('/blockchain/wallet')
    return response.data
  }
}

export default blockchainAPI
