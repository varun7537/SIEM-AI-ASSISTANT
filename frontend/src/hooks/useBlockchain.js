import { useState, useCallback } from 'react'
import { blockchainAPI } from '../services/blockchain'

export const useBlockchain = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAuditHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const history = await blockchainAPI.getAuditHistory()
      return history
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyTransaction = useCallback(async (txHash) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await blockchainAPI.verifyTransaction(txHash)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getBlockchainStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const stats = await blockchainAPI.getBlockchainStats()
      return stats
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getTransactionHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const history = await blockchainAPI.getTransactionHistory()
      return history
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getTransactionDetails = useCallback(async (txHash) => {
    try {
      setIsLoading(true)
      setError(null)
      const details = await blockchainAPI.getTransactionDetails(txHash)
      return details
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    getAuditHistory,
    verifyTransaction,
    getBlockchainStats,
    getTransactionHistory,
    getTransactionDetails
  }
}