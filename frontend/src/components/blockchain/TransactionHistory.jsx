import React, { useState, useEffect } from 'react'
import { History, ExternalLink, Copy, CheckCircle, Clock } from 'lucide-react'
import { useBlockchain } from '../../hooks/useBlockchain'
import { copyToClipboard, formatRelativeTime } from '../../utils/helpers'

const TransactionHistory = () => {
  const { getTransactionHistory, getTransactionDetails } = useBlockchain()
  const [transactions, setTransactions] = useState([])
  const [selectedTx, setSelectedTx] = useState(null)
  const [copiedHash, setCopiedHash] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const txHistory = await getTransactionHistory()
      setTransactions(txHistory)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  const handleSelectTransaction = async (txHash) => {
    try {
      const details = await getTransactionDetails(txHash)
      setSelectedTx(details)
    } catch (error) {
      console.error('Failed to load transaction details:', error)
    }
  }

  const handleCopyHash = async (hash) => {
    const success = await copyToClipboard(hash)
    if (success) {
      setCopiedHash(hash)
      setTimeout(() => setCopiedHash(''), 2000)
    }
  }

  return (
    <div className="h-full flex bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Transaction List */}
      <div className="w-2/3 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <History className="h-5 w-5 mr-2 text-blue-600" />
            Transaction History
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div
                key={index}
                onClick={() => handleSelectTransaction(tx.hash)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTx?.hash === tx.hash
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        {tx.status || 'Confirmed'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(tx.timestamp)}
                      </span>
                    </div>
                    
                    <p className="font-medium text-gray-900 mb-1">{tx.action}</p>
                    
                    <div className="flex items-center space-x-2">
                      <code className="text-xs text-gray-600 font-mono">
                        {tx.hash.substring(0, 20)}...{tx.hash.substring(tx.hash.length - 10)}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyHash(tx.hash)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedHash === tx.hash ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      Block #{tx.blockNumber || 'Pending'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Gas: {tx.gasUsed || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="w-1/3 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {selectedTx ? (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">Confirmed</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Transaction Hash</label>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="text-xs font-mono text-gray-900 break-all">
                    {selectedTx.hash}
                  </code>
                  <button
                    onClick={() => handleCopyHash(selectedTx.hash)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Block Number</label>
                <p className="mt-1 text-gray-900">{selectedTx.blockNumber || 'Pending'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Timestamp</label>
                <p className="mt-1 text-gray-900">
                  {new Date(selectedTx.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">From</label>
                <code className="mt-1 text-xs font-mono text-gray-900 break-all block">
                  {selectedTx.from}
                </code>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Gas Used</label>
                <p className="mt-1 text-gray-900">{selectedTx.gasUsed || 0}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Action Data</label>
                <pre className="mt-1 text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
                  {JSON.stringify(selectedTx.data, null, 2)}
                </pre>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ExternalLink className="h-4 w-4" />
                <span>View on Explorer</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a transaction to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory