import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import MessageBubble from './MessageBubble'
import QueryInput from './QueryInput'
import LoadingSpinner from '../Common/LoadingSpinner'
import { chatAPI } from '../../services/api'
import { MESSAGE_TYPES } from '../../utils/constants'
import { generateSessionId } from '../../utils/helpers'
import { RotateCcw, Sparkles, Zap, MessageSquare, TrendingUp } from 'lucide-react'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => generateSessionId())
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    // Add welcome message with enhanced styling
    const welcomeMessage = {
      id: uuidv4(),
      type: MESSAGE_TYPES.ASSISTANT,
      content: `# Welcome to SIEM NLP Assistant! 🛡️

I'm here to help you investigate security events, analyze logs, and generate comprehensive reports using natural language.

## What I can do:
- 🔍 **Search & Analyze**: "Show me failed login attempts from yesterday"
- 📊 **Generate Reports**: "Create a security summary for the past week"  
- 🚨 **Detect Threats**: "What malware detections occurred today?"
- 📈 **Visualize Data**: "Show me authentication patterns with charts"

## Ready to start?
Try one of the example queries from the sidebar, or simply ask me anything about your security data!`,
      timestamp: new Date(),
      metadata: { isWelcome: true }
    }
    
    setMessages([welcomeMessage])
    
    // Listen for queries from sidebar
    const handleSidebarQuery = (event) => {
      handleSendMessage(event.detail)
    }
    
    window.addEventListener('sendQuery', handleSidebarQuery)
    return () => window.removeEventListener('sendQuery', handleSidebarQuery)
  }, [])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return
    
    // Add user message
    const userMessage = {
      id: uuidv4(),
      type: MESSAGE_TYPES.USER,
      content: messageText,
      timestamp: new Date(),
      metadata: {}
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setSuggestions([])
    
    try {
      const response = await chatAPI.sendMessage(messageText, sessionId)
      
      // Add assistant response
      const assistantMessage = {
        id: uuidv4(),
        type: MESSAGE_TYPES.ASSISTANT,
        content: response.response,
        timestamp: new Date(),
        metadata: {
          intent: response.intent,
          confidence: response.confidence,
          data: response.data,
          visualization: response.visualization,
          queryUsed: response.query_used,
          executionTime: response.execution_time
        }
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setSuggestions(response.suggestions || [])
      
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message
      const errorMessage = {
        id: uuidv4(),
        type: MESSAGE_TYPES.ERROR,
        content: `I apologize, but I encountered an error while processing your request: ${error.message}. Please try again or rephrase your query.`,
        timestamp: new Date(),
        metadata: { error: error.message }
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }
  
  const handleClearChat = async () => {
    try {
      await chatAPI.clearSession(sessionId)
      setMessages([])
      setSuggestions([])
      
      // Re-add welcome message
      const welcomeMessage = {
        id: uuidv4(),
        type: MESSAGE_TYPES.ASSISTANT,
        content: "Chat cleared! 🧹 Ready for a fresh start. How can I help you with your security investigation?",
        timestamp: new Date(),
        metadata: {}
      }
      
      setMessages([welcomeMessage])
    } catch (error) {
      console.error('Error clearing chat:', error)
    }
  }
  
  return (
    <div className="h-full flex flex-col backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-60"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Security Investigation
            </h2>
            <p className="text-sm text-gray-600 flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>{messages.length - 1} queries processed</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={handleClearChat}
          className="flex items-center space-x-2 px-4 py-2 bg-white/70 hover:bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg transition-all duration-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md group"
        >
          <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
          <span className="font-medium">Clear Chat</span>
        </button>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ scrollbarGutter: 'stable' }}>
        <div className="p-6 space-y-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              onSuggestionClick={handleSuggestionClick}
              isLatest={index === messages.length - 1}
            />
          ))}
          
          {/* Enhanced Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <LoadingSpinner size="lg" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-ping"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Processing your query...</div>
                    <div className="text-sm text-gray-600">Analyzing security data</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="bg-gradient-to-r from-purple-50/50 to-blue-50/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-md">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-gray-800">Suggested Queries</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-white/70 hover:bg-white/90 text-gray-700 rounded-lg text-sm border border-white/30 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                  >
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Query Input */}
      <div className="p-6 border-t border-white/20 bg-white/50 backdrop-blur-sm">
        <QueryInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default ChatInterface