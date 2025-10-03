import React, { useState, useEffect } from 'react'
import { Shield, Activity, Lock, CheckCircle, AlertCircle, TrendingUp, Database, Zap, Eye, Copy, ExternalLink } from 'lucide-react'

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  return (
    <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
  )
}

const BlockchainDashboard = () => {
  // Mock hooks for demonstration
  const user = { blockchain_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' }
  const isLoading = false
  
  const [auditHistory, setAuditHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState({})
  const [copiedHash, setCopiedHash] = useState('')

  const sampleAuditHistory = [
    {
      action: 'user_login',
      timestamp: '2025-10-03T10:30:00Z',
      blockchain_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      details: { userId: 'user123', ip: '192.168.1.1', location: 'New York' }
    },
    {
      action: 'query_execution',
      timestamp: '2025-10-03T09:15:00Z',
      blockchain_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      details: { query: 'SELECT * FROM users', database: 'main_db' }
    },
    {
      action: 'user_logout',
      timestamp: '2025-10-02T15:45:00Z',
      blockchain_hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      details: { userId: 'user123', sessionId: 'session_456' }
    }
  ]

  const sampleStats = {
    totalTransactions: 1452,
    verifiedEvents: 1398,
    gasUsed: '2456789'
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setAuditHistory(sampleAuditHistory)
      setStats(sampleStats)
    } catch (error) {
      console.error('Failed to load blockchain data:', error)
      setAuditHistory(sampleAuditHistory)
      setStats(sampleStats)
    }
  }

  const handleVerifyTransaction = async (txHash) => {
    try {
      setVerificationStatus(prev => ({
        ...prev,
        [txHash]: true
      }))
    } catch (error) {
      console.error('Verification failed:', error)
      setVerificationStatus(prev => ({
        ...prev,
        [txHash]: false
      }))
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(text)
    setTimeout(() => setCopiedHash(''), 2000)
  }

  const getActionIcon = (action) => {
    switch(action) {
      case 'user_login':
        return <Lock className="h-5 w-5 text-emerald-600" />
      case 'user_logout':
        return <Shield className="h-5 w-5 text-gray-600" />
      case 'query_execution':
        return <Database className="h-5 w-5 text-blue-600" />
      default:
        return <Activity className="h-5 w-5 text-purple-600" />
    }
  }

  const getActionColor = (action) => {
    switch(action) {
      case 'user_login':
        return 'from-emerald-50 to-emerald-100 border-emerald-200'
      case 'user_logout':
        return 'from-gray-50 to-gray-100 border-gray-200'
      case 'query_execution':
        return 'from-blue-50 to-blue-100 border-blue-200'
      default:
        return 'from-purple-50 to-purple-100 border-purple-200'
    }
  }

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border border-blue-100">
          <LoadingSpinner size="xl" />
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading blockchain data...</p>
          <p className="mt-2 text-gray-500 text-sm">Connecting to distributed ledger</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Blockchain Security Ledger
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Immutable audit trail powered by distributed ledger technology
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl shadow-sm">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-sm font-semibold text-emerald-700">Network Status</span>
                <p className="text-xs text-emerald-600">Blockchain Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Database className="h-7 w-7 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Total Transactions</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {stats?.totalTransactions?.toLocaleString() || 0}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">All-time recorded events</p>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div className="px-2 py-1 bg-green-100 rounded-lg">
                <p className="text-xs font-bold text-green-700">
                  {((stats?.verifiedEvents / stats?.totalTransactions) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Verified Events</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
              {stats?.verifiedEvents?.toLocaleString() || 0}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Cryptographically validated</p>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <button 
                onClick={() => copyToClipboard(user?.blockchain_address)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Wallet Address</p>
            <p className="text-lg font-mono font-bold text-gray-900 truncate">
              {user?.blockchain_address ? `${user.blockchain_address.slice(0, 8)}...${user.blockchain_address.slice(-6)}` : '0x000...000'}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Your identity on-chain</p>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Gas Used</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent">
              {stats?.gasUsed ? (parseInt(stats.gasUsed) / 1000000).toFixed(2) : 0}M
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Computational resources</p>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Audit Events
            </h2>
            <p className="text-blue-100 mt-2 text-sm">Real-time activity stream from the blockchain</p>
          </div>
          
          <div className="p-6">
            {auditHistory.length > 0 ? (
              <div className="space-y-4">
                {auditHistory.map((event, index) => (
                  <div 
                    key={index}
                    className={`group relative bg-gradient-to-r ${getActionColor(event.action)} border rounded-2xl p-5 hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            {getActionIcon(event.action)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-900 text-lg capitalize">
                                {event.action?.replace('_', ' ')}
                              </h3>
                              <span className="px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 border border-gray-200">
                                Block #{index + 1}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              {new Date(event.timestamp).toLocaleString('en-US', { 
                                dateStyle: 'medium', 
                                timeStyle: 'short' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                          <div className="flex items-start gap-2 mb-3">
                            <p className="text-xs font-semibold text-gray-700">Transaction Hash</p>
                            <button
                              onClick={() => copyToClipboard(event.blockchain_hash)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Copy hash"
                            >
                              {copiedHash === event.blockchain_hash ? (
                                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-gray-500" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs font-mono text-gray-600 break-all bg-gray-50 p-2 rounded-lg border border-gray-200">
                            {event.blockchain_hash}
                          </p>
                          
                          {event.details && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-700 mb-2">Event Details</p>
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <pre className="text-xs text-gray-700 overflow-x-auto">
                                  {JSON.stringify(event.details, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex lg:flex-col gap-2">
                        <button
                          onClick={() => handleVerifyTransaction(event.blockchain_hash)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                            verificationStatus[event.blockchain_hash] === true
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                              : verificationStatus[event.blockchain_hash] === false
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                          }`}
                        >
                          {verificationStatus[event.blockchain_hash] === true ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Verified
                            </>
                          ) : verificationStatus[event.blockchain_hash] === false ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              Failed
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              Verify
                            </>
                          )}
                        </button>
                        
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md">
                          <ExternalLink className="h-4 w-4" />
                          <span className="hidden lg:inline">View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Shield className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium text-lg">No audit events yet</p>
                <p className="text-gray-500 text-sm mt-2">Events will appear here as they're recorded on the blockchain</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Blockchain Info Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-start gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                Enterprise-Grade Blockchain Security
                <CheckCircle className="h-6 w-6 text-green-300" />
              </h3>
              <p className="text-blue-100 leading-relaxed mb-4">
                All critical actions are logged to an immutable blockchain ledger, ensuring complete 
                transparency and tamper-proof audit trails. Each transaction is cryptographically signed 
                and can be independently verified by any party.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-white text-sm font-semibold">🔒 Immutable Records</p>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-white text-sm font-semibold">✓ Cryptographic Verification</p>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-white text-sm font-semibold">🌐 Distributed Consensus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockchainDashboard