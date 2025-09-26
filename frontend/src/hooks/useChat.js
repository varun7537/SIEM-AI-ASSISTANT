import { useState, useCallback } from 'react'
import { chatAPI } from '../services/api'

export const useChat = (sessionId) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await chatAPI.sendMessage(message, sessionId)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])
  
  const loadHistory = useCallback(async (limit = 20) => {
    try {
      const history = await chatAPI.getChatHistory(sessionId, limit)
      setMessages(history.messages || [])
    } catch (err) {
      setError(err.message)
    }
  }, [sessionId])
  
  const clearChat = useCallback(async () => {
    try {
      await chatAPI.clearSession(sessionId)
      setMessages([])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [sessionId])
  
  return {
    messages,
    setMessages,
    isLoading,
    error,
    sendMessage,
    loadHistory,
    clearChat
  }
}