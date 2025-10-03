import React, { useState, useRef } from 'react'
import { Send, Mic, Paperclip, Sparkles, Command } from 'lucide-react'

const QueryInput = ({ onSendMessage, disabled = false, placeholder = "Ask me anything..." }) => {
  const [query, setQuery] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && !disabled) {
      onSendMessage(query.trim())
      setQuery('')
      textareaRef.current?.focus()
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  const handleInputChange = (e) => {
    setQuery(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
  
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsRecording(true)
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setQuery(prev => prev + (prev ? ' ' : '') + transcript)
      }
      
      recognition.onend = () => {
        setIsRecording(false)
      }
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        alert('Speech recognition failed. Please try again or use a supported browser.')
      }
      
      recognition.start()
    } else {
      console.warn('Speech recognition not supported')
      alert('Speech recognition is not supported in this browser. Please use a modern browser like Chrome.')
    }
  }
  
  const getCharacterCountColor = () => {
    const length = query.length
    if (length > 900) return 'text-red-500 font-medium'
    if (length > 750) return 'text-orange-500 font-medium'
    if (length > 600) return 'text-yellow-600 font-medium'
    return 'text-gray-400' // Fallback color
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto relative z-10" style={{ minHeight: '100px' }}>
      {/* Input Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
          isFocused 
            ? 'border-blue-400 shadow-blue-100 shadow-xl' 
            : disabled 
              ? 'border-gray-200 shadow-sm' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
        } ${disabled ? 'opacity-60' : ''}`}>
          
          {/* Magic Sparkle Indicator */}
          {isFocused && !disabled && (
            <div className="absolute -top-1 -right-1 z-10">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-full shadow-lg animate-pulse">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          )}
          
          {/* Main Input Area */}
          <div className="flex items-end p-4 gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className="w-full resize-none bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base leading-relaxed pr-24"
                style={{ minHeight: '32px', maxHeight: '120px' }}
              />
              
              {/* Floating Action Buttons */}
              <div className="absolute right-0 bottom-0 flex items-center gap-1">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={disabled}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-100 text-red-600 shadow-lg shadow-red-200 animate-pulse scale-110' 
                      : disabled 
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:scale-105 active:scale-95'
                  }`}
                  title={isRecording ? "Recording..." : "Voice input"}
                >
                  <Mic className="h-4 w-4" />
                </button>
                
                {/* File Attachment Button */}
                <button
                  type="button"
                  disabled={true}
                  className="p-2.5 rounded-xl text-gray-300 cursor-not-allowed relative group"
                  title="Attach file (Coming soon)"
                >
                  <Paperclip className="h-4 w-4" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Coming soon
                  </div>
                </button>
              </div>
            </div>
            
            {/* Enhanced Send Button */}
            <button
              type="submit"
              disabled={disabled || !query.trim()}
              className={`relative p-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                disabled || !query.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Send</span>
              
              {/* Keyboard Shortcut Hint */}
              {!disabled && query.trim() && (
                <div className="hidden lg:flex items-center gap-1 ml-2 px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  <Command className="h-3 w-3" />
                  <span>⏎</span>
                </div>
              )}
            </button>
          </div>
          
          {/* Enhanced Bottom Bar */}
          <div className="flex justify-between items-center px-4 pb-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Recording Status */}
              {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 text-sm font-medium">Recording...</span>
                </div>
              )}
              
              {/* Quick Tips */}
              {!isRecording && query.length === 0 && isFocused && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Enter</div>
                    <span>to send</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Shift+Enter</div>
                    <span>new line</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Character Count with Progress */}
            <div className="flex items-center gap-2">
              {query.length > 0 && (
                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${
                      query.length > 900 ? 'bg-red-500' :
                      query.length > 750 ? 'bg-orange-500' :
                      query.length > 600 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((query.length / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
              <span className={`text-xs font-medium tabular-nums ${getCharacterCountColor()}`}>
                {query.length > 0 ? `${query.length}/1000` : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Input Enhancement Overlay */}
        {isFocused && !disabled && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
        )}
      </form>
      
      {/* Enhanced Status Messages */}
      {disabled && (
        <div className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <span>Processing your request...</span>
        </div>
      )}
      
      {query.length > 950 && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>Approaching character limit ({1000 - query.length} characters remaining)</span>
        </div>
      )}
    </div>
  )
}

export default QueryInput