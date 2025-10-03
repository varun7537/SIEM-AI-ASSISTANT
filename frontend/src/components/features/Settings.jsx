import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Database, 
  Shield, 
  Bell, 
  Users, 
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
  Mail,
  Slack,
  Globe,
  UserPlus,
  Edit,
  Trash2,
  Info
} from 'lucide-react'

const Settings = () => {
  const [settings, setSettings] = useState({
    elasticsearch: {
      host: 'localhost:9200',
      username: 'elastic',
      password: '••••••••',
      ssl: false,
      index: 'siem-logs',
      max_results: 1000
    },
    wazuh: {
      api_url: 'https://localhost:55000',
      username: 'wazuh',
      password: '••••••••',
      port: 55000,
      verify_ssl: true
    },
    blockchain: {
      rpc_url: 'http://localhost:8545',
      enabled: true,
      chain_id: 1,
      contract_address: ''
    },
    notifications: {
      email_alerts: true,
      slack_integration: false,
      webhook_url: '',
      email_address: '',
      slack_channel: '',
      alert_threshold: 'high'
    },
    team: {
      users: [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { id: 2, name: 'Security Analyst', email: 'analyst@example.com', role: 'analyst' }
      ]
    }
  })

  const [activeTab, setActiveTab] = useState('elasticsearch')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'analyst' })

  const handleInputChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleTestConnection = async (type) => {
    setIsTesting(true)
    setTestResult(null)

    setTimeout(() => {
      setTestResult({
        success: true,
        message: `${type} connection successful!`
      })
      setIsTesting(false)
    }, 2000)
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
  }

  const addUser = () => {
    if (newUser.name && newUser.email) {
      setSettings(prev => ({
        ...prev,
        team: {
          ...prev.team,
          users: [...prev.team.users, { id: Date.now(), ...newUser }]
        }
      }))
      setNewUser({ name: '', email: '', role: 'analyst' })
    }
  }

  const editUser = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      team: {
        ...prev.team,
        users: prev.team.users.map(user => 
          user.id === id ? { ...user, [field]: value } : user
        )
      }
    }))
  }

  const deleteUser = (id) => {
    setSettings(prev => ({
      ...prev,
      team: {
        ...prev.team,
        users: prev.team.users.filter(user => user.id !== id)
      }
    }))
  }

  const tabs = [
    { id: 'elasticsearch', name: 'Elasticsearch', icon: Database, color: 'emerald' },
    { id: 'wazuh', name: 'Wazuh', icon: Shield, color: 'blue' },
    { id: 'blockchain', name: 'Blockchain', icon: Key, color: 'purple' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'amber' },
    { id: 'team', name: 'Team', icon: Users, color: 'rose' }
  ]

  const getActiveTabColor = () => {
    const tab = tabs.find(t => t.id === activeTab)
    return tab?.color || 'blue'
  }

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
      icon: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700',
      icon: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-700'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      button: 'bg-rose-600 hover:bg-rose-700',
      icon: 'text-rose-600',
      badge: 'bg-rose-100 text-rose-700'
    }
  }

  const currentColor = colorClasses[getActiveTabColor()]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <SettingsIcon className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  System Settings
                </h1>
              </div>
              <p className="text-gray-600 ml-14">Configure and manage your SIEM assistant</p>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 w-full md:w-auto justify-center font-medium"
            >
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 sticky top-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  const colors = colorClasses[tab.color]
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                        isActive
                          ? `${colors.bg} ${colors.text} ${colors.border} border-2 shadow-lg`
                          : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <tab.icon className={`h-5 w-5 ${isActive ? colors.icon : 'text-gray-500'}`} />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className={`${currentColor.bg} border-b ${currentColor.border} px-6 py-5`}>
                <div className="flex items-center gap-3">
                  {tabs.find(t => t.id === activeTab) && (
                    <>
                      {React.createElement(tabs.find(t => t.id === activeTab).icon, {
                        className: `h-6 w-6 ${currentColor.icon}`
                      })}
                      <h2 className={`text-2xl font-bold ${currentColor.text}`}>
                        {tabs.find(t => t.id === activeTab).name} Configuration
                      </h2>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Elasticsearch Settings */}
                {activeTab === 'elasticsearch' && (
                  <div className="space-y-6">
                    <div className={`${currentColor.bg} ${currentColor.border} border-l-4 p-4 rounded-r-xl`}>
                      <div className="flex items-start gap-3">
                        <Info className={`h-5 w-5 ${currentColor.icon} mt-0.5`} />
                        <p className={`text-sm ${currentColor.text}`}>
                          Configure connection to your Elasticsearch cluster for log aggregation and analysis
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Host Address
                        </label>
                        <input
                          type="text"
                          value={settings.elasticsearch.host}
                          onChange={(e) => handleInputChange('elasticsearch', 'host', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          placeholder="localhost:9200"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            value={settings.elasticsearch.username}
                            onChange={(e) => handleInputChange('elasticsearch', 'username', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            value={settings.elasticsearch.password}
                            onChange={(e) => handleInputChange('elasticsearch', 'password', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Default Index
                        </label>
                        <input
                          type="text"
                          value={settings.elasticsearch.index}
                          onChange={(e) => handleInputChange('elasticsearch', 'index', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          placeholder="siem-logs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max Results per Query
                        </label>
                        <input
                          type="number"
                          value={settings.elasticsearch.max_results}
                          onChange={(e) => handleInputChange('elasticsearch', 'max_results', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          placeholder="1000"
                        />
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <input
                          type="checkbox"
                          id="es-ssl"
                          checked={settings.elasticsearch.ssl}
                          onChange={(e) => handleInputChange('elasticsearch', 'ssl', e.target.checked)}
                          className="w-5 h-5 text-emerald-600 rounded-lg focus:ring-4 focus:ring-emerald-500/20"
                        />
                        <label htmlFor="es-ssl" className="text-sm font-semibold text-gray-900 cursor-pointer">
                          Enable SSL/TLS encryption
                        </label>
                      </div>

                      <button
                        onClick={() => handleTestConnection('Elasticsearch')}
                        disabled={isTesting}
                        className={`w-full px-6 py-4 ${currentColor.button} text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg font-semibold`}
                      >
                        {isTesting ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>Testing Connection...</span>
                          </>
                        ) : (
                          <>
                            <Database className="h-5 w-5" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>

                      {testResult && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 border-2 ${
                          testResult.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          {testResult.success ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                          <span className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                            {testResult.message}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Wazuh Settings */}
                {activeTab === 'wazuh' && (
                  <div className="space-y-6">
                    <div className={`${currentColor.bg} ${currentColor.border} border-l-4 p-4 rounded-r-xl`}>
                      <div className="flex items-start gap-3">
                        <Info className={`h-5 w-5 ${currentColor.icon} mt-0.5`} />
                        <p className={`text-sm ${currentColor.text}`}>
                          Configure connection to your Wazuh manager for security monitoring and threat detection
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          API URL
                        </label>
                        <input
                          type="text"
                          value={settings.wazuh.api_url}
                          onChange={(e) => handleInputChange('wazuh', 'api_url', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          placeholder="https://wazuh-manager:55000"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            value={settings.wazuh.username}
                            onChange={(e) => handleInputChange('wazuh', 'username', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            value={settings.wazuh.password}
                            onChange={(e) => handleInputChange('wazuh', 'password', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Port
                        </label>
                        <input
                          type="number"
                          value={settings.wazuh.port}
                          onChange={(e) => handleInputChange('wazuh', 'port', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          placeholder="55000"
                        />
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <input
                          type="checkbox"
                          id="wazuh-ssl"
                          checked={settings.wazuh.verify_ssl}
                          onChange={(e) => handleInputChange('wazuh', 'verify_ssl', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-500/20"
                        />
                        <label htmlFor="wazuh-ssl" className="text-sm font-semibold text-gray-900 cursor-pointer">
                          Verify SSL Certificate
                        </label>
                      </div>

                      <button
                        onClick={() => handleTestConnection('Wazuh')}
                        disabled={isTesting}
                        className={`w-full px-6 py-4 ${currentColor.button} text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg font-semibold`}
                      >
                        {isTesting ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>Testing Connection...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-5 w-5" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>

                      {testResult && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 border-2 ${
                          testResult.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          {testResult.success ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                          <span className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                            {testResult.message}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Blockchain Settings */}
                {activeTab === 'blockchain' && (
                  <div className="space-y-6">
                    <div className={`${currentColor.bg} ${currentColor.border} border-l-4 p-4 rounded-r-xl`}>
                      <div className="flex items-start gap-3">
                        <Info className={`h-5 w-5 ${currentColor.icon} mt-0.5`} />
                        <p className={`text-sm ${currentColor.text}`}>
                          Configure blockchain integration for immutable audit logging and tamper-proof record keeping
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <div className={`flex items-center gap-4 p-5 ${currentColor.bg} rounded-xl border-2 ${currentColor.border}`}>
                        <input
                          type="checkbox"
                          id="blockchain-enabled"
                          checked={settings.blockchain.enabled}
                          onChange={(e) => handleInputChange('blockchain', 'enabled', e.target.checked)}
                          className="w-5 h-5 text-purple-600 rounded-lg focus:ring-4 focus:ring-purple-500/20"
                        />
                        <label htmlFor="blockchain-enabled" className={`text-sm font-semibold ${currentColor.text} cursor-pointer`}>
                          Enable Blockchain Audit Logging
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          RPC URL
                        </label>
                        <input
                          type="text"
                          value={settings.blockchain.rpc_url}
                          onChange={(e) => handleInputChange('blockchain', 'rpc_url', e.target.value)}
                          disabled={!settings.blockchain.enabled}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50"
                          placeholder="http://localhost:8545"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Chain ID
                        </label>
                        <input
                          type="number"
                          value={settings.blockchain.chain_id}
                          onChange={(e) => handleInputChange('blockchain', 'chain_id', parseInt(e.target.value))}
                          disabled={!settings.blockchain.enabled}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50"
                          placeholder="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Smart Contract Address
                        </label>
                        <input
                          type="text"
                          value={settings.blockchain.contract_address}
                          onChange={(e) => handleInputChange('blockchain', 'contract_address', e.target.value)}
                          disabled={!settings.blockchain.enabled}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50"
                          placeholder="0x..."
                        />
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                          <Key className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-purple-900 mb-2">About Blockchain Integration</h4>
                            <p className="text-sm text-purple-800 leading-relaxed">
                              All security actions are logged to an immutable blockchain ledger, ensuring complete 
                              transparency and tamper-proof audit trails for compliance and forensic analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className={`${currentColor.bg} ${currentColor.border} border-l-4 p-4 rounded-r-xl`}>
                      <div className="flex items-start gap-3">
                        <Info className={`h-5 w-5 ${currentColor.icon} mt-0.5`} />
                        <p className={`text-sm ${currentColor.text}`}>
                          Configure alert notifications to stay informed about security events in real-time
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <input
                          type="checkbox"
                          id="email-alerts"
                          checked={settings.notifications.email_alerts}
                          onChange={(e) => handleInputChange('notifications', 'email_alerts', e.target.checked)}
                          className="w-5 h-5 text-amber-600 rounded-lg focus:ring-4 focus:ring-amber-500/20"
                        />
                        <label htmlFor="email-alerts" className="text-sm font-semibold text-gray-900 flex items-center gap-2 cursor-pointer">
                          <Mail className="h-5 w-5 text-amber-600" />
                          <span>Enable Email Alerts</span>
                        </label>
                      </div>

                      {settings.notifications.email_alerts && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settings.notifications.email_address}
                            onChange={(e) => handleInputChange('notifications', 'email_address', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                            placeholder="alerts@example.com"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <input
                          type="checkbox"
                          id="slack-integration"
                          checked={settings.notifications.slack_integration}
                          onChange={(e) => handleInputChange('notifications', 'slack_integration', e.target.checked)}
                          className="w-5 h-5 text-amber-600 rounded-lg focus:ring-4 focus:ring-amber-500/20"
                        />
                        <label htmlFor="slack-integration" className="text-sm font-semibold text-gray-900 flex items-center gap-2 cursor-pointer">
                          <Slack className="h-5 w-5 text-amber-600" />
                          <span>Enable Slack Integration</span>
                        </label>
                      </div>

                      {settings.notifications.slack_integration && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Slack Channel
                          </label>
                          <input
                            type="text"
                            value={settings.notifications.slack_channel}
                            onChange={(e) => handleInputChange('notifications', 'slack_channel', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                            placeholder="#siem-alerts"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="text"
                          value={settings.notifications.webhook_url}
                          onChange={(e) => handleInputChange('notifications', 'webhook_url', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                          placeholder="https://hooks.example.com/webhook"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Alert Threshold
                        </label>
                        <select
                          value={settings.notifications.alert_threshold}
                          onChange={(e) => handleInputChange('notifications', 'alert_threshold', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleTestConnection('Notifications')}
                        disabled={isTesting}
                        className={`w-full px-6 py-4 ${currentColor.button} text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg font-semibold`}
                      >
                        {isTesting ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <Globe className="h-5 w-5" />
                            <span>Test Notifications</span>
                          </>
                        )}
                      </button>

                      {testResult && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 border-2 ${
                          testResult.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          {testResult.success ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                          <span className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                            {testResult.message}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Team Settings */}
                {activeTab === 'team' && (
                  <div className="space-y-6">
                    <div className={`${currentColor.bg} ${currentColor.border} border-l-4 p-4 rounded-r-xl`}>
                      <div className="flex items-start gap-3">
                        <Info className={`h-5 w-5 ${currentColor.icon} mt-0.5`} />
                        <p className={`text-sm ${currentColor.text}`}>
                          Manage team members and their access levels to your SIEM assistant
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Add New User Card */}
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                          <UserPlus className="h-6 w-6 text-rose-600" />
                          <span>Add New Team Member</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={newUser.name}
                              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none bg-white"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none bg-white"
                              placeholder="john@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Role
                            </label>
                            <select
                              value={newUser.role}
                              onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                              className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none bg-white"
                            >
                              <option value="admin">Admin</option>
                              <option value="analyst">Analyst</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={addUser}
                          className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg font-semibold"
                        >
                          <UserPlus className="h-5 w-5" />
                          <span>Add Team Member</span>
                        </button>
                      </div>

                      {/* User List */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Users className="h-6 w-6 text-rose-600" />
                          <span>Current Team Members</span>
                          <span className="ml-auto text-sm font-semibold px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
                            {settings.team.users.length} Members
                          </span>
                        </h3>
                        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Email
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Role
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {settings.team.users.map((user, index) => (
                                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) => editUser(user.id, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => editUser(user.id, 'email', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <select
                                        value={user.role}
                                        onChange={(e) => editUser(user.id, 'role', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium"
                                      >
                                        <option value="admin">Admin</option>
                                        <option value="analyst">Analyst</option>
                                        <option value="viewer">Viewer</option>
                                      </select>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => console.log('Edit', user.id)}
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                          title="Edit User"
                                        >
                                          <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                          onClick={() => deleteUser(user.id)}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                          title="Delete User"
                                        >
                                          <Trash2 className="h-5 w-5" />
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings