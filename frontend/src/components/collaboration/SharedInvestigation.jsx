import React, { useState, useEffect } from 'react'
import { Users, Share2, Eye, FileText, Search, Plus } from 'lucide-react'
import { useCollaboration } from '../../hooks/useCollaboration'
import { formatRelativeTime } from '../../utils/helpers'

const SharedInvestigation = ({ investigationId }) => {
  const { 
    getInvestigation, 
    shareQueryResult, 
    addEvidence,
    getParticipants 
  } = useCollaboration()
  
  const [investigation, setInvestigation] = useState(null)
  const [participants, setParticipants] = useState([])
  const [activeTab, setActiveTab] = useState('queries')
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    loadInvestigationData()
  }, [investigationId])

  const loadInvestigationData = async () => {
    try {
      const [invData, partData] = await Promise.all([
        getInvestigation(investigationId),
        getParticipants(investigationId)
      ])
      setInvestigation(invData)
      setParticipants(partData)
    } catch (error) {
      console.error('Failed to load investigation:', error)
    }
  }

  if (!investigation) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{investigation.title}</h2>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Participants */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Team:</span>
          <div className="flex items-center -space-x-2">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="relative group"
                style={{ zIndex: participants.length - index }}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white ${
                  participant.online ? 'ring-2 ring-green-500' : ''
                }`}>
                  {participant.avatar}
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {participant.name}
                  {participant.online && ' (online)'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {['queries', 'evidence', 'timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'queries' && (
          <div className="space-y-4">
            {investigation.shared_queries?.map((query) => (
              <div key={query.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      {query.user_name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{query.user_name}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(query.timestamp)}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>View Results</span>
                  </button>
                </div>
                <p className="text-gray-700 mb-3">"{query.query}"</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{query.results_summary?.total_events || 0} results</span>
                  {query.results_summary?.event_types?.map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investigation.evidence?.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border-2 border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    item.criticality === 'high' ? 'bg-red-100 text-red-700' :
                    item.criticality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.criticality}
                  </span>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {item.user_name}</span>
                  <span>{formatRelativeTime(item.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {investigation.timeline?.map((event) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">
                      {event.user_name} {event.action.replace('_', ' ')}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                  </div>
                  {event.details && (
                    <p className="text-sm text-gray-600">{JSON.stringify(event.details)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SharedInvestigation