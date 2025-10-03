import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  MessageSquare,
  Share2,
  FileText,
  Clock,
  User,
  Search,
  Filter,
  Send,
  Paperclip,
  Eye,
  Flag,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  X,
  TrendingUp,
  Activity
} from 'lucide-react';

const CollaborativeWorkspace = () => {
  const [investigations, setInvestigations] = useState([]);
  const [activeInvestigation, setActiveInvestigation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const user = { id: 'user_1', full_name: 'Current User', username: 'currentuser' };
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadInvestigations();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeInvestigation?.collaborative_notes]);

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const loadInvestigations = async () => {
    try {
      setIsLoading(true);
      const mockInvestigations = [
        {
          id: 'inv_1',
          title: 'Suspicious Login Activity - Executive Accounts',
          description: 'Multiple failed login attempts detected on executive accounts from foreign IP addresses',
          creator_id: 'user_1',
          status: 'active',
          priority: 'high',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          participants: ['user_1', 'user_2', 'user_3'],
          shared_queries: 2,
          evidence_count: 5,
          notes_count: 8
        },
        {
          id: 'inv_2',
          title: 'Data Exfiltration Alert - Finance Department',
          description: 'Unusual large file transfers detected during non-business hours',
          creator_id: 'user_2',
          status: 'active',
          priority: 'critical',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          participants: ['user_1', 'user_2'],
          shared_queries: 7,
          evidence_count: 12,
          notes_count: 15
        },
        {
          id: 'inv_3',
          title: 'Phishing Campaign Targeting HR',
          description: 'Spear-phishing emails detected targeting HR personnel with malicious attachments',
          creator_id: 'user_3',
          status: 'active',
          priority: 'medium',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          participants: ['user_2', 'user_3', 'user_4'],
          shared_queries: 4,
          evidence_count: 8,
          notes_count: 10
        },
        {
          id: 'inv_4',
          title: 'Insider Threat Investigation',
          description: 'Unauthorized access to sensitive documents by internal user',
          creator_id: 'user_1',
          status: 'pending',
          priority: 'high',
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          participants: ['user_1', 'user_4'],
          shared_queries: 3,
          evidence_count: 6,
          notes_count: 5
        }
      ];
      setInvestigations(mockInvestigations);
    } catch (error) {
      console.error('Failed to load investigations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInvestigation = async (data) => {
    try {
      await loadInvestigations();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create investigation:', error);
      throw error;
    }
  };

  const loadInvestigationDetails = async (investigationId) => {
    try {
      const mockDetails = {
        id: investigationId,
        title: investigations.find(inv => inv.id === investigationId)?.title || 'Investigation',
        participants: [
          { id: 'user_1', name: 'Alice Johnson', role: 'Lead Analyst', avatar: 'AJ', online: true },
          { id: 'user_2', name: 'Bob Smith', role: 'Security Engineer', avatar: 'BS', online: false },
          { id: 'user_3', name: 'Carol Williams', role: 'Incident Responder', avatar: 'CW', online: true },
          { id: 'user_4', name: 'David Brown', role: 'Threat Intelligence Analyst', avatar: 'DB', online: true }
        ],
        timeline: [
          {
            id: 'tl_1',
            user_id: 'user_1',
            user_name: 'Alice Johnson',
            action: 'created_investigation',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            details: { title: 'Investigation created' }
          },
          {
            id: 'tl_2',
            user_id: 'user_2',
            user_name: 'Bob Smith',
            action: 'shared_query',
            timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            details: { query: 'Failed login attempts from IP 192.168.1.100', results_count: 45 }
          },
          {
            id: 'tl_3',
            user_id: 'user_3',
            user_name: 'Carol Williams',
            action: 'added_evidence',
            timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
            details: { title: 'Added new log evidence' }
          },
          {
            id: 'tl_4',
            user_id: 'user_4',
            user_name: 'David Brown',
            action: 'shared_query',
            timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
            details: { query: 'Suspicious email patterns', results_count: 30 }
          }
        ],
        shared_queries: [
          {
            id: 'query_1',
            user_id: 'user_1',
            user_name: 'Alice Johnson',
            query: 'Show me failed login attempts from yesterday for executive accounts',
            results_summary: { total_events: 23, event_types: ['authentication_failure'] },
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            annotations: []
          },
          {
            id: 'query_2',
            user_id: 'user_2',
            user_name: 'Bob Smith',
            query: 'Find all network connections from suspicious IP ranges',
            results_summary: { total_events: 156, event_types: ['network_connection', 'firewall_block'] },
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            annotations: [
              { user: 'Alice Johnson', note: 'These IPs are known threat actors', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() }
            ]
          },
          {
            id: 'query_3',
            user_id: 'user_4',
            user_name: 'David Brown',
            query: 'Analyze email metadata for phishing patterns',
            results_summary: { total_events: 45, event_types: ['email_received', 'attachment_detected'] },
            timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            annotations: [
              { user: 'Carol Williams', note: 'Confirmed malicious attachment', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() }
            ]
          }
        ],
        collaborative_notes: [
          {
            id: 'note_1',
            user_id: 'user_1',
            user_name: 'Alice Johnson',
            avatar: 'AJ',
            content: 'Initial analysis shows coordinated attack pattern. The timing suggests automated tools.',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            replies: []
          },
          {
            id: 'note_2',
            user_id: 'user_2',
            user_name: 'Bob Smith',
            avatar: 'BS',
            content: 'Confirmed. Found similar patterns in our threat intelligence feeds. Recommending immediate password reset for affected accounts.',
            timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
            replies: [
              {
                id: 'reply_1',
                user_id: 'user_3',
                user_name: 'Carol Williams',
                avatar: 'CW',
                content: 'Already coordinating with IT team for password resets. Should be completed within the hour.',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
              }
            ]
          },
          {
            id: 'note_3',
            user_id: 'user_3',
            user_name: 'Carol Williams',
            avatar: 'CW',
            content: 'Update: All affected accounts have been secured. Implementing additional MFA requirements.',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            replies: []
          },
          {
            id: 'note_4',
            user_id: 'user_4',
            user_name: 'David Brown',
            avatar: 'DB',
            content: 'Found additional evidence of phishing attempts in email logs. Suggest analyzing email headers.',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            replies: []
          }
        ],
        evidence: [
          {
            id: 'evidence_1',
            type: 'log_file',
            title: 'Authentication Logs - Executive Accounts',
            description: 'Extracted authentication logs showing suspicious patterns',
            user_name: 'Alice Johnson',
            timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
            criticality: 'high'
          },
          {
            id: 'evidence_2',
            type: 'network_traffic',
            title: 'Network Flow Analysis',
            description: 'Detailed network traffic analysis from suspicious IP addresses',
            user_name: 'Bob Smith',
            timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
            criticality: 'medium'
          },
          {
            id: 'evidence_3',
            type: 'email_log',
            title: 'Phishing Email Headers',
            description: 'Captured email headers from suspicious emails',
            user_name: 'David Brown',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            criticality: 'high'
          }
        ]
      };
      setActiveInvestigation(mockDetails);
    } catch (error) {
      console.error('Failed to load investigation details:', error);
    }
  };

  const addCollaborativeNote = async () => {
    if (!newNote.trim() || !activeInvestigation) return;

    try {
      const mockNote = {
        id: `note_${Date.now()}`,
        user_id: user.id,
        user_name: user.full_name || user.username,
        avatar: user.username.substring(0, 2).toUpperCase(),
        content: newNote,
        timestamp: new Date().toISOString(),
        replies: []
      };

      setActiveInvestigation(prev => ({
        ...prev,
        collaborative_notes: [...prev.collaborative_notes, mockNote]
      }));

      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200 ring-1 ring-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 ring-1 ring-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200 ring-1 ring-green-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'high': return <TrendingUp className="h-3 w-3" />;
      case 'medium': return <Activity className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  const CreateInvestigationModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'medium'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createInvestigation(formData);
      } catch (error) {
        console.error('Creation failed:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              New Investigation
            </h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter investigation title..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                rows="4"
                placeholder="Provide a brief description..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
              <div className="grid grid-cols-4 gap-2">
                {['low', 'medium', 'high', 'critical'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({...formData, priority})}
                    className={`px-4 py-2 rounded-xl font-medium text-sm capitalize transition-all ${
                      formData.priority === priority
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 font-medium transition-all"
              >
                Create Investigation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredInvestigations = investigations.filter(inv =>
    inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Investigations List */}
      <div className="w-96 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Users className="h-7 w-7 mr-3 text-blue-600" />
                Investigations
              </h2>
              <p className="text-sm text-gray-500 mt-1">{investigations.length} active cases</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investigations..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading investigations...</p>
            </div>
          ) : filteredInvestigations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No investigations found</p>
            </div>
          ) : (
            filteredInvestigations.map((investigation) => (
            <div
              key={investigation.id}
              onClick={() => loadInvestigationDetails(investigation.id)}
              className={`p-5 mx-3 my-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                activeInvestigation?.id === investigation.id 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg ring-2 ring-blue-200' 
                  : 'bg-white hover:shadow-md hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm leading-5 flex-1 mr-2">
                  {investigation.title}
                </h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${getPriorityColor(investigation.priority)}`}>
                  {getPriorityIcon(investigation.priority)}
                  {investigation.priority}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                {investigation.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center bg-blue-50 px-2 py-1 rounded-lg">
                    <Users className="h-3.5 w-3.5 mr-1 text-blue-600" />
                    <span className="font-medium text-blue-700">{investigation.participants?.length || 0}</span>
                  </span>
                  <span className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                    <MessageSquare className="h-3.5 w-3.5 mr-1 text-green-600" />
                    <span className="font-medium text-green-700">{investigation.notes_count || 0}</span>
                  </span>
                  <span className="flex items-center bg-purple-50 px-2 py-1 rounded-lg">
                    <FileText className="h-3.5 w-3.5 mr-1 text-purple-600" />
                    <span className="font-medium text-purple-700">{investigation.evidence_count || 0}</span>
                  </span>
                </div>
                <span className="flex items-center text-xs text-gray-400 font-medium">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {formatRelativeTime(investigation.created_at)}
                </span>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {/* Investigation Details */}
      <div className="flex-1 flex flex-col">
        {activeInvestigation ? (
          <>
            {/* Header */}
            <div className="p-6 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">{activeInvestigation.title}</h1>
                <div className="flex items-center space-x-2">
                  <button className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                    <Flag className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700">Team:</span>
                  <div className="flex items-center -space-x-2">
                    {activeInvestigation.participants?.map((participant) => (
                      <div 
                        key={participant.id} 
                        className="relative group"
                        title={`${participant.name} (${participant.role})`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold ring-4 ring-white transition-transform hover:scale-110 hover:z-10 ${participant.online ? 'ring-green-400' : ''}`}>
                          {participant.avatar}
                        </div>
                        {participant.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-3 border-white rounded-full"></div>
                        )}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {participant.name}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{activeInvestigation.participants?.filter(p => p.online).length}</span> online
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Chat/Notes Area */}
              <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50/50 to-blue-50/30">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeInvestigation.collaborative_notes?.map((note) => (
                    <div key={note.id} className="flex space-x-3 animate-fadeIn">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                        {note.avatar}
                      </div>
                      <div className="flex-1 max-w-3xl">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-gray-900">{note.user_name}</span>
                            <span className="text-xs text-gray-400 font-medium">{formatRelativeTime(note.timestamp)}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{note.content}</p>
                          
                          {note.replies?.map((reply) => (
                            <div key={reply.id} className="mt-4 ml-4 pl-4 border-l-2 border-blue-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {reply.avatar}
                                </div>
                                <span className="text-sm font-bold text-gray-800">{reply.user_name}</span>
                                <span className="text-xs text-gray-400">{formatRelativeTime(reply.timestamp)}</span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 bg-white/90 backdrop-blur-xl border-t border-gray-200/50">
                  <div className="flex space-x-3 items-end">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCollaborativeNote()}
                          placeholder="Add a note to the investigation..."
                          className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all outline-none shadow-sm"
                        />
                        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                          <Paperclip className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={addCollaborativeNote}
                      disabled={!newNote.trim()}
                      className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-96 bg-white/80 backdrop-blur-xl border-l border-gray-200/50 overflow-y-auto shadow-xl">
                <div className="p-6 space-y-6">
                  {/* Shared Queries */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <Search className="h-5 w-5 mr-2 text-blue-600" />
                        Shared Queries
                      </h3>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        {activeInvestigation.shared_queries?.length || 0}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {activeInvestigation.shared_queries?.map((query) => (
                        <div key={query.id} className="bg-gradient-to-br from-white to-blue-50/30 p-4 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-800">{query.user_name}</span>
                            <span className="text-xs text-gray-400 font-medium">{formatRelativeTime(query.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 font-medium italic">"{query.query}"</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                {query.results_summary?.total_events} results
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-all">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </div>
                          
                          {query.annotations?.map((annotation, idx) => (
                            <div key={idx} className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                              <div className="flex items-start space-x-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-bold text-amber-900 text-xs">{annotation.user}</div>
                                  <div className="text-amber-800 text-xs mt-1">{annotation.note}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-purple-600" />
                        Evidence
                      </h3>
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                        {activeInvestigation.evidence?.length || 0}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {activeInvestigation.evidence?.map((evidence) => (
                        <div key={evidence.id} className="bg-gradient-to-br from-white to-purple-50/30 p-4 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 ${
                              evidence.criticality === 'high' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
                              evidence.criticality === 'medium' ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200' :
                              'bg-green-100 text-green-700 ring-1 ring-green-200'
                            }`}>
                              {evidence.criticality === 'high' ? <AlertTriangle className="h-3 w-3" /> : 
                               evidence.criticality === 'medium' ? <Activity className="h-3 w-3" /> :
                               <CheckCircle className="h-3 w-3" />}
                              {evidence.criticality}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{formatRelativeTime(evidence.timestamp)}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2">{evidence.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed mb-3">{evidence.description}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              Added by <span className="font-semibold text-gray-700">{evidence.user_name}</span>
                            </span>
                            <button className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-semibold hover:bg-purple-50 px-3 py-1 rounded-lg transition-all">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-green-600" />
                        Timeline
                      </h3>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {activeInvestigation.timeline?.length || 0}
                      </span>
                    </div>
                    <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-300 before:via-purple-300 before:to-pink-300">
                      {activeInvestigation.timeline?.map((event, idx) => (
                        <div key={event.id} className="relative pl-8">
                          <div className="absolute left-0 top-2 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full ring-4 ring-white shadow-md"></div>
                          <div className="bg-gradient-to-br from-white to-green-50/30 p-4 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-gray-800">{event.user_name}</span>
                              <span className="text-xs text-gray-400 font-medium">{formatRelativeTime(event.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium mb-1">
                              {event.action === 'created_investigation' ? '🎯 Created investigation' : 
                               event.action === 'shared_query' ? '🔍 Shared a query' : 
                               '📎 Added evidence'}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">{event.details.title || event.details.query}</p>
                            {event.details.results_count && (
                              <div className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                {event.details.results_count} results
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Select an Investigation</h3>
              <p className="text-gray-500">Choose an investigation from the list to view details and collaborate</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Investigation Modal */}
      {showCreateModal && <CreateInvestigationModal />}
    </div>
  );
};

export default CollaborativeWorkspace;