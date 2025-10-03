import { useState, useCallback, useEffect } from 'react'
import { collaborationAPI } from '../services/collaboration'
import { websocketService } from '../services/websocket'

export const useCollaboration = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updates, setUpdates] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    websocketService.connect()

    websocketService.on('update', (update) => {
      setUpdates(prev => [update, ...prev])
    })

    websocketService.on('message', (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      websocketService.disconnect()
    }
  }, [])

  const getInvestigation = useCallback(async (investigationId) => {
    try {
      setIsLoading(true)
      setError(null)
      const investigation = await collaborationAPI.getInvestigation(investigationId)
      return investigation
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createInvestigation = useCallback(async (data) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await collaborationAPI.createInvestigation(data)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const joinInvestigation = useCallback(async (investigationId) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await collaborationAPI.joinInvestigation(investigationId)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const shareQueryResult = useCallback(async (investigationId, queryData) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await collaborationAPI.shareQueryResult(investigationId, queryData)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addEvidence = useCallback(async (investigationId, evidence) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await collaborationAPI.addEvidence(investigationId, evidence)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getParticipants = useCallback(async (investigationId) => {
    try {
      const result = await collaborationAPI.getParticipants(investigationId)
      return result
    } catch (err) {
      console.error('Failed to get participants:', err)
      return []
    }
  }, [])

  const sendMessage = useCallback(async (investigationId, message) => {
    try {
      const result = await collaborationAPI.sendMessage(investigationId, message)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const subscribeToMessages = useCallback((investigationId) => {
    websocketService.subscribe(`investigation:${investigationId}:messages`)
    
    return () => {
      websocketService.unsubscribe(`investigation:${investigationId}:messages`)
    }
  }, [])

  const markAsRead = useCallback((updateId) => {
    setUpdates(prev => 
      prev.map(update => 
        update.id === updateId ? { ...update, read: true } : update
      )
    )
  }, [])

  const clearUpdate = useCallback((updateId) => {
    setUpdates(prev => prev.filter(update => update.id !== updateId))
  }, [])

  return {
    isLoading,
    error,
    updates,
    messages,
    getInvestigation,
    createInvestigation,
    joinInvestigation,
    shareQueryResult,
    addEvidence,
    getParticipants,
    sendMessage,
    subscribeToMessages,
    markAsRead,
    clearUpdate
  }
}