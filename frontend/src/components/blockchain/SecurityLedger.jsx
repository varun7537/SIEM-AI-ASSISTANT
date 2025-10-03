import React, { useState, useEffect } from 'react'
import { FileText, Download, Filter, Search, Calendar, Shield } from 'lucide-react'
import { useBlockchain } from '../../hooks/useBlockchain'
import { downloadJSON, downloadCSV } from '../../utils/helpers'

const SecurityLedger = () => {
  const { getAuditHistory } = useBlockchain()
  const [ledgerEntries, setLedgerEntries] = useState([])
  const [filteredEntries, setFilteredEntries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    loadLedger()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterType, dateRange, ledgerEntries])

  const loadLedger = async () => {
    try {
      const entries = await getAuditHistory()
      setLedgerEntries(entries)
    } catch (error) {
      console.error('Failed to load ledger:', error)
    }
  }

  const applyFilters = () => {
    let filtered = [...ledgerEntries]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.blockchain_hash.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(entry => entry.action === filterType)
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.timestamp)
        return entryDate >= new Date(dateRange.start) && entryDate <= new Date(dateRange.end)
      })
    }

    setFilteredEntries(filtered)
  }

  const handleExport = (format) => {
    const exportData = filteredEntries.map(entry => ({
      action: entry.action,
      timestamp: entry.timestamp,
      blockchain_hash: entry.blockchain_hash,
      user_id: entry.user_id,
      details: JSON.stringify(entry.details)
    }))

    if (format === 'json') {
      downloadJSON(exportData, `security-ledger-${Date.now()}`)
    } else if (format === 'csv') {
      downloadCSV(exportData, `security-ledger-${Date.now()}`)
    }
  }

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 mr-3 text-blue-600" />
            Security Audit Ledger
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="user_login">Login</option>
            <option value="user_logout">Logout</option>
            <option value="query_execution">Query</option>
            <option value="report_generation">Report</option>
          </select>

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Blockchain Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    <span className="truncate block max-w-xs">{entry.blockchain_hash}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center text-sm text-green-600">
                      <Shield className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No entries found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredEntries.length} of {ledgerEntries.length} entries</span>
          <span>All entries are cryptographically secured</span>
        </div>
      </div>
    </div>
  )
}

export default SecurityLedger