import { useState, useCallback } from 'react';
import { chatAPI } from '../services/api';

export const useChat = (sessionId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validate sessionId
  if (!sessionId) {
    console.warn('useChat: sessionId is required');
  }

  const sendMessage = useCallback(async (message) => {
    if (!message?.trim()) {
      return null; // Return null for empty messages
    }

    if (!sessionId) {
      setError('Session ID is missing');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatAPI.sendMessage(message, sessionId);
      setMessages((prevMessages) => [...prevMessages, { text: message, response }]);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const loadHistory = useCallback(async (limit = 20) => {
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const history = await chatAPI.getChatHistory(sessionId, limit);
      setMessages(history.messages || []);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load chat history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(async () => {
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await chatAPI.clearSession(sessionId);
      setMessages([]);
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear chat';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  return {
    messages,
    setMessages,
    isLoading,
    error,
    sendMessage,
    loadHistory,
    clearChat,
  };
};