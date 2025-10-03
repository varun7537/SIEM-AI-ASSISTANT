import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RotateCcw, Sparkles, Zap, MessageSquare, TrendingUp, User, Copy, ThumbsUp, ThumbsDown, Moon, Sun, Clipboard } from 'lucide-react';

// Mock constants
const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  ERROR: 'error',
};

// Mock generateSessionId
const generateSessionId = () => {
  return uuidv4();
};

// Mock chatAPI
const chatAPI = {
  sendMessage: async (messageText, sessionId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          response: `Echo: ${messageText}`,
          intent: 'general',
          confidence: 0.9,
          data: {},
          visualization: null, // Could be HTML string or data for chart
          query_used: messageText,
          execution_time: 0.5,
          suggestions: ['Show recent logs', 'Analyze failed logins'],
        });
      }, 1000);
    });
  },
  clearSession: async (sessionId) => {
    return Promise.resolve();
  },
};

// Format timestamp
const formatTimestamp = (date) => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// MessageBubble Component
const MessageBubble = ({ message, onSuggestionClick, isLatest, onCopy, onFeedback, theme }) => {
  const isUser = message.type === MESSAGE_TYPES.USER;
  const isError = message.type === MESSAGE_TYPES.ERROR;
  
  const bgColor = isUser
    ? 'bg-blue-600 text-white'
    : isError
    ? 'bg-red-50 text-red-900'
    : theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-900';
    
  const alignment = isUser ? 'ml-auto' : 'mr-auto';
  const borderRadius = isUser 
    ? 'rounded-tl-xl rounded-tr-none rounded-bl-xl rounded-br-xl'
    : 'rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-xl';

  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 max-w-3xl ${alignment}`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 w-full`}>
        {/* Profile Icon */}
        <div className="flex-shrink-0 mt-2">
          {isUser ? (
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          ) : (
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        
        {/* Message Content */}
        <div className={`p-4 ${bgColor} ${borderRadius} shadow-sm max-w-[80%] border ${borderColor}`}>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: message.content }} />
          
          {/* Visualization */}
          {message.metadata?.visualization && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="text-sm font-medium mb-2">Visualization:</div>
              <div dangerouslySetInnerHTML={{ __html: message.metadata.visualization }} />
            </div>
          )}
          
          {/* Metadata */}
          {message.metadata?.intent && !isUser && (
            <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-2">
              <span>Intent: {message.metadata.intent} ({(message.metadata.confidence * 100).toFixed(0)}%)</span>
              <span>Query: {message.metadata.queryUsed}</span>
              <span>Time: {message.metadata.executionTime}s</span>
            </div>
          )}
          
          {/* Suggestions */}
          {isLatest && message.metadata?.suggestions?.length > 0 && !isUser && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.metadata.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-white/80 hover:bg-white text-gray-700 rounded-md text-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {/* Actions */}
          {!isUser && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              <button onClick={() => onCopy(message.content)} className="flex items-center gap-1 hover:text-blue-500">
                <Copy className="h-3 w-3" />
                Copy
              </button>
              <button onClick={() => onFeedback('up')} className="flex items-center gap-1 hover:text-green-500">
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button onClick={() => onFeedback('down')} className="flex items-center gap-1 hover:text-red-500">
                <ThumbsDown className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

// QueryInput Component
const QueryInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about security data..."
        className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-900 placeholder-gray-400 transition-all duration-200"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
        disabled={isLoading}
      >
        Send
      </button>
    </form>
  );
};

// LoadingSpinner Component
const LoadingSpinner = ({ size = 'lg' }) => {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <div className={`animate-spin rounded-full ${sizeClass} border-t-2 border-blue-500`}></div>
  );
};

// TypingIndicator Component
const TypingIndicator = () => (
  <div className="flex space-x-2">
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300"></div>
  </div>
);

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [theme, setTheme] = useState('light'); // New: light/dark theme
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage = {
      id: uuidv4(),
      type: MESSAGE_TYPES.ASSISTANT,
      content: `
        <div class="space-y-2">
          <h2 class="text-xl font-semibold text-gray-900">Welcome to SIEM NLP Assistant! 🛡️</h2>
          <p class="text-gray-700">Your intelligent partner for security investigations. I can help you analyze logs, detect threats, and generate reports using natural language.</p>
          <div class="mt-4">
            <h3 class="font-medium text-gray-800">What I can do:</h3>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
              <li><span class="font-medium text-blue-600">Search & Analyze:</span> "Show failed logins from yesterday"</li>
              <li><span class="font-medium text-blue-600">Generate Reports:</span> "Create a security summary for last week"</li>
              <li><span class="font-medium text-blue-600">Detect Threats:</span> "What malware detections occurred today?"</li>
              <li><span class="font-medium text-blue-600">Visualize Data:</span> "Show authentication patterns with charts"</li>
            </ul>
          </div>
          <p class="text-gray-700">Try an example query or ask anything about your security data!</p>
        </div>
      `,
      timestamp: new Date(),
      metadata: { isWelcome: true, suggestions: ['Show recent logs', 'Analyze failed logins'] },
    };

    setMessages([welcomeMessage]);

    // Listen for queries from sidebar
    const handleSidebarQuery = (event) => {
      handleSendMessage(event.detail);
    };

    window.addEventListener('sendQuery', handleSidebarQuery);
    return () => window.removeEventListener('sendQuery', handleSidebarQuery);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      type: MESSAGE_TYPES.USER,
      content: messageText,
      timestamp: new Date(),
      metadata: {},
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(messageText, sessionId);

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
          executionTime: response.execution_time,
          suggestions: response.suggestions || [],
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: uuidv4(),
        type: MESSAGE_TYPES.ERROR,
        content: `Sorry, I hit a snag: ${error.message}. Please try again or rephrase your query.`,
        timestamp: new Date(),
        metadata: { error: error.message },
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = async () => {
    try {
      await chatAPI.clearSession(sessionId);
      setMessages([]);

      const welcomeMessage = {
        id: uuidv4(),
        type: MESSAGE_TYPES.ASSISTANT,
        content: `
          <div class="space-y-2">
            <h2 class="text-lg font-semibold text-gray-900">Chat Cleared! 🧹</h2>
            <p class="text-gray-700">Ready for a fresh start. How can I assist with your security investigation?</p>
          </div>
        `,
        timestamp: new Date(),
        metadata: {},
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    // Optional: show toast
  };

  const handleFeedback = (type) => {
    console.log(`Feedback: ${type}`);
    // Optional: send to API
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const bgTheme = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const headerBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const inputBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';

  return (
    <div className={`h-screen flex flex-col rounded-2xl shadow-xl overflow-hidden ${bgTheme}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${headerBg}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-md">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Security Investigation</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>{messages.length - 1} queries processed</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 rounded-md transition-all duration-200"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-100 rounded-md text-gray-600 hover:text-gray-900 shadow-sm hover:shadow transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
            <span className="text-sm">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            onSuggestionClick={handleSuggestionClick}
            isLatest={index === messages.length - 1}
            onCopy={handleCopy}
            onFeedback={handleFeedback}
            theme={theme}
          />
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className={`flex items-center gap-3 p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <TypingIndicator />
              <div className="text-sm text-gray-500">Typing...</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input */}
      <div className={`p-4 border-t ${inputBg}`}>
        <QueryInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;