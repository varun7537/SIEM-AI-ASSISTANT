import React, { useState } from 'react'
import { 
  MessageCircle, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Zap
} from 'lucide-react'
import { EXAMPLE_QUERIES, REPORT_TEMPLATES } from '../../utils/constants'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('chat')
  
  const navigation = [
    { id: 'chat', name: 'Chat', icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'reports', name: 'Reports', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
    { id: 'help', name: 'Help', icon: HelpCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
  ]
  
  const handleExampleQuery = (query) => {
    window.dispatchEvent(new CustomEvent('sendQuery', { detail: query }))
  }
  
  return (
    <div className={`backdrop-blur-xl bg-white/40 border-r border-white/30 shadow-xl transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">Assistant</h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/50 transition-all duration-200 group"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="p-3 space-y-2">
        {navigation.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                isActive
                  ? `${item.bg} ${item.border} border shadow-sm`
                  : 'hover:bg-white/50 border border-transparent'
              }`}
            >
              <div className="flex items-center p-3 relative z-10">
                <div className={`${isActive ? item.color : 'text-gray-600 group-hover:text-gray-900'} transition-colors duration-200`}>
                  <item.icon className="h-5 w-5" />
                </div>
                {!collapsed && (
                  <span className={`ml-3 font-medium transition-colors duration-200 ${
                    isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {item.name}
                  </span>
                )}
              </div>
              {isActive && !collapsed && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          )
        })}
      </nav>
      
      {/* Content Based on Active Section */}
      {!collapsed && (
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
          {activeSection === 'chat' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-gray-900">Quick Start</h3>
                </div>
                <div className="space-y-3">
                  {EXAMPLE_QUERIES.slice(0, 5).map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleQuery(query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/60 transition-all duration-200 border border-white/30 backdrop-blur-sm group"
                    >
                      <div className="text-sm text-gray-800 group-hover:text-gray-900 leading-relaxed">
                        "{query}"
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Try this query</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Pro Tip</h4>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Ask follow-up questions to drill down into specific events or request visualizations to better understand patterns.
                </p>
              </div>
            </div>
          )}
          
          {activeSection === 'reports' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  <h3 className="font-semibold text-gray-900">Report Templates</h3>
                </div>
                <div className="space-y-3">
                  {REPORT_TEMPLATES.map((template, index) => (
                    <button
                      key={template.id}
                      onClick={() => handleExampleQuery(template.query)}
                      className="w-full text-left p-4 rounded-lg hover:bg-white/60 transition-all duration-200 border border-white/30 backdrop-blur-sm group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {template.description}
                          </div>
                          <div className="flex items-center mt-2 text-xs text-emerald-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>Generate Report</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'help' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <HelpCircle className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-gray-900">Getting Started</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <strong className="text-blue-900">Natural Language</strong>
                    </div>
                    <p className="text-sm text-blue-800">Ask questions like you would to a security colleague</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <strong className="text-emerald-900">Time Ranges</strong>
                    </div>
                    <p className="text-sm text-emerald-800">Use "yesterday", "last week", "past month" for easy filtering</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <strong className="text-purple-900">Visualizations</strong>
                    </div>
                    <p className="text-sm text-purple-800">Request charts and graphs to visualize security data</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <strong className="text-amber-900">Follow-up</strong>
                    </div>
                    <p className="text-sm text-amber-800">Ask follow-up questions to drill down into specific areas</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {(activeSection === 'analytics' || activeSection === 'settings') && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeSection === 'analytics' ? (
                  <BarChart3 className="h-8 w-8 text-gray-500" />
                ) : (
                  <Settings className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <h3 className="font-medium text-gray-900 mb-2 capitalize">{activeSection}</h3>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Sidebar