import React, { useState, useEffect } from 'react'
import {
  Shield,
  Users,
  Activity,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Server,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Zap,
  HardDrive,
  Cpu,
  Globe,
  Key,
  Mail,
  Phone,
  Calendar,
  Award,
  FileText,
  Link as LinkIcon
} from 'lucide-react'
import { Link } from 'react-router-dom' // Added import for react-router-dom Link
import { adminAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { formatTimestamp, formatRelativeTime } from '../../utils/helpers'
import LoadingSpinner from '../Common/LoadingSpinner'
import ChartComponents from '../Reports/ChartComponents'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [users, setUsers] = useState([])
  const [systemStats, setSystemStats] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadDashboardData()
  }, [activeTab])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      switch (activeTab) {
        case 'overview':
          await loadOverviewData()
          break
        case 'users':
          await loadUsersData()
          break
        case 'system':
          await loadSystemStats()
          break
        case 'audit':
          await loadAuditLogs()
          break
        default:
          break
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOverviewData = async () => {
    // Mock data - replace with actual API call
    const mockData = {
      totalUsers: 247,
      activeUsers: 189,
      totalQueries: 15847,
      activeInvestigations: 23,
      threatsDetected: 156,
      blockchainTransactions: 3421,
      systemHealth: 'healthy',
      uptime: '99.98%',
      avgResponseTime: '142ms',
      storageUsed: '67%',
      cpuUsage: '34%',
      memoryUsage: '58%',
      recentActivity: [
        { user: 'Alice Johnson', action: 'Created investigation', time: new Date(Date.now() - 5 * 60 * 1000) },
        { user: 'Bob Smith', action: 'Generated threat report', time: new Date(Date.now() - 12 * 60 * 1000) },
        { user: 'Carol Williams', action: 'Shared query results', time: new Date(Date.now() - 18 * 60 * 1000) },
        { user: 'David Brown', action: 'Added evidence to investigation', time: new Date(Date.now() - 25 * 60 * 1000) },
        { user: 'Eve Davis', action: 'Executed security query', time: new Date(Date.now() - 32 * 60 * 1000) }
      ],
      userGrowth: [
        { month: 'Jan', users: 180 },
        { month: 'Feb', users: 195 },
        { month: 'Mar', users: 210 },
        { month: 'Apr', users: 225 },
        { month: 'May', users: 240 },
        { month: 'Jun', users: 247 }
      ],
      queryStats: {
        totalQueries: 15847,
        avgQueriesPerDay: 523,
        topQueryTypes: [
          { type: 'Search Logs', count: 6547, percentage: 41 },
          { type: 'Generate Report', count: 4231, percentage: 27 },
          { type: 'Statistics', count: 3189, percentage: 20 },
          { type: 'Filter Results', count: 1880, percentage: 12 }
        ]
      }
    }
    setDashboardData(mockData)
  }

  const loadUsersData = async () => {
    // Mock data - replace with actual API call
    const mockUsers = [
      {
        id: 1,
        username: 'alice.johnson',
        email: 'alice@company.com',
        full_name: 'Alice Johnson',
        role: 'Admin',
        is_active: true,
        is_superuser: true,
        created_at: new Date('2024-01-15'),
        last_login: new Date(Date.now() - 2 * 60 * 60 * 1000),
        queries_count: 1547,
        investigations_count: 34,
        blockchain_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      },
      {
        id: 2,
        username: 'bob.smith',
        email: 'bob@company.com',
        full_name: 'Bob Smith',
        role: 'Analyst',
        is_active: true,
        is_superuser: false,
        created_at: new Date('2024-02-20'),
        last_login: new Date(Date.now() - 5 * 60 * 60 * 1000),
        queries_count: 892,
        investigations_count: 18,
        blockchain_address: '0x8e8D4c5F52E7D9a8B54e3c1F92a5b6c8d9e2f3a4'
      },
      {
        id: 3,
        username: 'carol.williams',
        email: 'carol@company.com',
        full_name: 'Carol Williams',
        role: 'Analyst',
        is_active: true,
        is_superuser: false,
        created_at: new Date('2024-03-10'),
        last_login: new Date(Date.now() - 30 * 60 * 1000),
        queries_count: 673,
        investigations_count: 12,
        blockchain_address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
      },
      {
        id: 4,
        username: 'david.brown',
        email: 'david@company.com',
        full_name: 'David Brown',
        role: 'Viewer',
        is_active: false,
        is_superuser: false,
        created_at: new Date('2024-04-05'),
        last_login: new Date(Date.now() - 48 * 60 * 60 * 1000),
        queries_count: 234,
        investigations_count: 3,
        blockchain_address: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e'
      }
    ]
    setUsers(mockUsers)
  }

  const loadSystemStats = async () => {
    // Mock data - replace with actual API call
    const mockStats = {
      server: {
        hostname: 'siem-prod-01',
        platform: 'Linux',
        uptime: 2592000, // 30 days in seconds
        cpu: {
          model: 'Intel Xeon E5-2680 v4',
          cores: 16,
          usage: 34.5
        },
        memory: {
          total: 64,
          used: 37,
          free: 27,
          usage: 58
        },
        disk: {
          total: 2048,
          used: 1372,
          free: 676,
          usage: 67
        }
      },
      services: {
        backend: { status: 'healthy', uptime: '99.98%', responseTime: '142ms' },
        frontend: { status: 'healthy', uptime: '99.99%', responseTime: '89ms' },
        elasticsearch: { status: 'healthy', uptime: '99.95%', responseTime: '45ms' },
        postgresql: { status: 'healthy', uptime: '99.97%', responseTime: '23ms' },
        redis: { status: 'healthy', uptime: '100%', responseTime: '5ms' },
        blockchain: { status: 'healthy', uptime: '99.92%', responseTime: '187ms' }
      },
      metrics: {
        requestsPerSecond: 347,
        errorRate: 0.12,
        avgLatency: 142,
        activeConnections: 189,
        queuedJobs: 23,
        cacheHitRate: 87.3
      }
    }
    setSystemStats(mockStats)
  }

  const loadAuditLogs = async () => {
    // Mock data - replace with actual API call
    const mockLogs = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: 'alice.johnson',
        action: 'user.login',
        resource: 'Authentication',
        ip_address: '192.168.1.100',
        status: 'success',
        blockchain_hash: '0x1a2b3c4d5e6f...'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        user: 'bob.smith',
        action: 'query.execute',
        resource: 'SIEM Query',
        ip_address: '192.168.1.105',
        status: 'success',
        blockchain_hash: '0x9f8e7d6c5b4a...'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        user: 'carol.williams',
        action: 'investigation.create',
        resource: 'Investigation-234',
        ip_address: '192.168.1.110',
        status: 'success',
        blockchain_hash: '0x5a6b7c8d9e0f...'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        user: 'unknown',
        action: 'user.login',
        resource: 'Authentication',
        ip_address: '203.0.113.45',
        status: 'failed',
        blockchain_hash: null
      }
    ]
    setAuditLogs(mockLogs)
  }

  const handleUserAction = async (userId, action) => {
    try {
      // API call to perform action
      console.log(`Performing ${action} on user ${userId}`)
      // Reload users after action
      await loadUsersData()
    } catch (error) {
      console.error('Action failed:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'analyst':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'viewer':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}d ${hours}h`
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Render different tabs
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.totalUsers}</p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {dashboardData?.activeUsers} active
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-500 opacity-60" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Queries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.totalQueries?.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                <Activity className="h-3 w-3 mr-1" />
                Today: 523
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-purple-500 opacity-60" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investigations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.activeInvestigations}</p>
              <p className="text-sm text-orange-600 mt-2 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Active cases
              </p>
            </div>
            <Shield className="h-12 w-12 text-orange-500 opacity-60" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blockchain TXs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.blockchainTransactions?.toLocaleString()}</p>
              <p className="text-sm text-emerald-600 mt-2 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                All verified
              </p>
            </div>
            <LinkIcon className="h-12 w-12 text-emerald-500 opacity-60" /> {/* Fixed typo: Link Icon -> LinkIcon */}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="h-5 w-5 mr-2 text-blue-600" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(dashboardData?.systemHealth)}`}>
                {dashboardData?.systemHealth}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-gray-900">{dashboardData?.uptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Response</span>
              <span className="text-sm font-medium text-gray-900">{dashboardData?.avgResponseTime}</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData?.cpuUsage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: dashboardData?.cpuUsage }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData?.memoryUsage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: dashboardData?.memoryUsage }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData?.storageUsed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: dashboardData?.storageUsed }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {dashboardData?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{activity.user}</span>
                    <span className="text-xs text-gray-500">{formatRelativeTime(activity.time)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Query Statistics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Top Query Types</h4>
            <div className="space-y-3">
              {dashboardData?.queryStats?.topQueryTypes?.map((queryType, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{queryType.type}</span>
                    <span className="text-sm font-medium text-gray-900">{queryType.count} ({queryType.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${queryType.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-4">User Growth</h4>
            <div className="h-64">
              {dashboardData?.userGrowth && (
                <ChartComponents 
                  data={{
                    data: [{
                      x: dashboardData.userGrowth.map(d => d.month),
                      y: dashboardData.userGrowth.map(d => d.users),
                      type: 'scatter',
                      mode: 'lines+markers',
                      marker: { color: '#3b82f6', size: 8 },
                      line: { color: '#3b82f6', width: 3 }
                    }],
                    layout: {
                      title: '',
                      xaxis: { title: 'Month' },
                      yaxis: { title: 'Users' }
                    }
                  }}
                  height={240}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">{users.length} total users</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or username..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-5 w-5 text-gray-600" />
          <span>Filters</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Activity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {u.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.full_name}</div>
                        <div className="text-sm text-gray-600">{u.email}</div>
                        <div className="text-xs text-gray-500 font-mono">{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${u.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {u.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      <span>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{u.queries_count} queries</div>
                      <div className="text-gray-600">{u.investigations_count} investigations</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatRelativeTime(u.last_login)}</div>
                    <div className="text-xs text-gray-600">{formatTimestamp(u.last_login)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(u)
                          setShowUserModal(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleUserAction(u.id, 'edit')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleUserAction(u.id, u.is_active ? 'deactivate' : 'activate')}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title={u.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {u.is_active ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={() => handleUserAction(u.id, 'delete')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSystem = () => (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Server className="h-5 w-5 mr-2 text-blue-600" />
          Server Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Hostname</div>
            <div className="font-medium text-gray-900">{systemStats?.server.hostname}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Platform</div>
            <div className="font-medium text-gray-900">{systemStats?.server.platform}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Uptime</div>
            <div className="font-medium text-gray-900">{systemStats?.server.uptime && formatUptime(systemStats.server.uptime)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">CPU Model</div>
            <div className="font-medium text-gray-900">{systemStats?.server.cpu.model}</div>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Cpu className="h-5 w-5 mr-2 text-blue-600" />
              CPU Usage
            </h4>
            <span className="text-2xl font-bold text-gray-900">{systemStats?.server.cpu.usage}%</span>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${systemStats?.server.cpu.usage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              ></div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div>Cores: {systemStats?.server.cpu.cores}</div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <HardDrive className="h-5 w-5 mr-2 text-purple-600" />
              Memory Usage
            </h4>
            <span className="text-2xl font-bold text-gray-900">{systemStats?.server.memory.usage}%</span>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${systemStats?.server.memory.usage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
              ></div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div>Used: {systemStats?.server.memory.used} GB / {systemStats?.server.memory.total} GB</div>
            <div>Free: {systemStats?.server.memory.free} GB</div>
          </div>
        </div>

        {/* Disk Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Database className="h-5 w-5 mr-2 text-orange-600" />
              Disk Usage
            </h4>
            <span className="text-2xl font-bold text-gray-900">{systemStats?.server.disk.usage}%</span>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${systemStats?.server.disk.usage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
              ></div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div>Used: {systemStats?.server.disk.used} GB / {systemStats?.server.disk.total} GB</div>
            <div>Free: {systemStats?.server.disk.free} GB</div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          Services Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemStats?.services && Object.entries(systemStats.services).map(([service, data]) => (
            <div key={service} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 capitalize">{service}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Uptime:</span>
                  <span className="font-medium">{data.uptime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response:</span>
                  <span className="font-medium">{data.responseTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-600" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Requests/Second</div>
              <div className="text-2xl font-bold text-gray-900">{systemStats?.metrics.requestsPerSecond}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="text-2xl font-bold text-gray-900">{systemStats?.metrics.errorRate}%</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Latency</div>
              <div className="text-2xl font-bold text-gray-900">{systemStats?.metrics.avgLatency}ms</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Connections</div>
              <div className="text-2xl font-bold text-gray-900">{systemStats?.metrics.activeConnections}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Queued Jobs</div>
              <div className="text-2xl font-bold text-gray-900">{systemStats?.metrics.queuedJobs}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Database className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Cache Hit Rate</div>
              <div className="text-2xl font-bold text-gray-900">{systemStats?.metrics.cacheHitRate}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAuditLogs = () => (
    <div className="space-y-6">
      {/* Audit Logs Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
          <p className="text-gray-600 mt-1">All system activities are logged on blockchain</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={loadAuditLogs}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Resource</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">IP Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Blockchain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatTimestamp(log.timestamp)}</div>
                    <div className="text-xs text-gray-600">{formatRelativeTime(log.timestamp)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{log.user}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.resource}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-gray-900">{log.ip_address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.blockchain_hash ? (
                      <Link 
                        to={`/blockchain/transactions/${log.blockchain_hash}`} 
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                        title="View on blockchain"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span className="font-mono">{log.blockchain_hash.substring(0, 10)}...</span>
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">Not logged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // User Detail Modal
  const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* User Profile */}
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Username</div>
                <div className="font-medium text-gray-900">{user.username}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">User ID</div>
                <div className="font-medium text-gray-900">#{user.id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Created</div>
                <div className="font-medium text-gray-900">{formatTimestamp(user.created_at)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Last Login</div>
                <div className="font-medium text-gray-900">{formatRelativeTime(user.last_login)}</div>
              </div>
            </div>

            {/* Activity Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Activity Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total Queries</div>
                  <div className="text-2xl font-bold text-blue-600">{user.queries_count}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Investigations</div>
                  <div className="text-2xl font-bold text-purple-600">{user.investigations_count}</div>
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-blue-600" />
                Blockchain Wallet
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Wallet Address</div>
                  <div className="font-mono text-sm text-gray-900 break-all bg-white p-2 rounded border border-gray-200">
                    {user.blockchain_address}
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            {user.is_superuser && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Superuser Privileges
                </h4>
                <p className="text-sm text-purple-800">This user has full administrative access to the system.</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => handleUserAction(user.id, 'edit')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading && !dashboardData && !users.length && !systemStats && !auditLogs.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-60"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span>System administration and monitoring</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              Logged in as: <span className="font-medium text-gray-900">{user?.full_name || 'Admin'}</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'system'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Server className="h-5 w-5" />
              <span>System</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'system' && renderSystem()}
          {activeTab === 'audit' && renderAuditLogs()}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setShowUserModal(false)} />
      )}
    </div>
  )
}

export default AdminPanel