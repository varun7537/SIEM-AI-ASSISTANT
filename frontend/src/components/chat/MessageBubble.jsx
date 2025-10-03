import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, AlertTriangle, Clock, Database, TrendingUp, BarChart3 } from 'lucide-react';
import { MESSAGE_TYPES } from '../../utils/constants';
import { formatTimestamp, formatRelativeTime, getSeverityColor } from '../../utils/helpers';
import ChartComponents from '../Reports/ChartComponents';

const MessageBubble = ({ message }) => {
  // Fallback for missing message prop
  if (!message || !message.content || !message.type || !message.timestamp) {
    return (
      <div className="message-bubble mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
        Error: Invalid message data
      </div>
    );
  }

  const getIcon = () => {
    switch (message.type) {
      case MESSAGE_TYPES.USER:
        return <User className="h-5 w-5 text-blue-600" />;
      case MESSAGE_TYPES.ASSISTANT:
        return <Bot className="h-5 w-5 text-emerald-600" />;
      case MESSAGE_TYPES.ERROR:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bot className="h-5 w-5 text-slate-500" />;
    }
  };

  const getBubbleClass = () => {
    switch (message.type) {
      case MESSAGE_TYPES.USER:
        return 'user-message';
      case MESSAGE_TYPES.ERROR:
        return 'error-message';
      default:
        return 'assistant-message';
    }
  };

  const getMessageStyles = () => {
    switch (message.type) {
      case MESSAGE_TYPES.USER:
        return 'ml-auto max-w-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25';
      case MESSAGE_TYPES.ERROR:
        return 'max-w-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 text-red-800 shadow-sm';
      default:
        return 'max-w-4xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200';
    }
  };

  const renderMetadata = () => {
    if (!message.metadata || message.type !== MESSAGE_TYPES.ASSISTANT) return null;

    const { intent, confidence, data, executionTime } = message.metadata;

    return (
      <div className="mt-6 space-y-4">
        {/* Query Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm text-slate-600">
            {intent && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Intent:</span>
                <span className="text-slate-800 font-semibold">{intent}</span>
              </div>
            )}
            {confidence && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
                <div
                  className={`h-2 w-2 rounded-full ${
                    confidence > 0.8 ? 'bg-green-500' : confidence > 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                ></div>
                <span className="font-medium">Confidence:</span>
                <span className="text-slate-800 font-semibold">{Math.round(confidence * 100)}%</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-slate-600 mt-4 sm:mt-0">
            {executionTime && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span className="font-semibold text-slate-800">{executionTime.toFixed(2)}s</span>
              </div>
            )}
            {data?.total_hits !== undefined && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
                <Database className="h-4 w-4 text-purple-500" />
                <span className="font-semibold text-slate-800">{data.total_hits.toLocaleString()}</span>
                <span className="text-slate-600">events</span>
              </div>
            )}
          </div>
        </div>

        {/* Data Summary */}
        {data?.summary && (
          <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              <h4 className="text-lg font-semibold text-slate-800">Event Summary</h4>
            </div>
            {data.summary.event_types && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(data.summary.event_types).map(([type, count]) => (
                  <div
                    key={type}
                    className="group bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  >
                    <div className="text-2xl font-bold text-slate-800 mb-1">{count.toLocaleString()}</div>
                    <div className="text-sm text-slate-600 capitalize font-medium">{type.replace('_', ' ')}</div>
                    <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform origin-left group-hover:scale-x-105 transition-transform duration-200"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Table */}
        {data?.events && data.events.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-slate-600" />
                  <h4 className="text-lg font-semibold text-slate-800">Recent Events</h4>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                  {data.events.length} events
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Severity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Source IP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.events.slice(0, 5).map((event, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {formatRelativeTime(event.timestamp) || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {event.event_type?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                            event.severity
                          )}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              event.severity === 'high'
                                ? 'bg-red-400'
                                : event.severity === 'medium'
                                ? 'bg-yellow-400'
                                : 'bg-green-400'
                            }`}
                          ></div>
                          {event.severity || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800 font-mono bg-slate-50">
                        {event.source_ip || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                        <div className="truncate" title={event.description}>
                          {event.description || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.events.length > 5 && (
              <div className="px-6 py-3 bg-slate-50 text-sm text-slate-600 text-center border-t border-slate-200">
                Showing 5 of {data.events.length} events
                <span className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                  View all →
                </span>
              </div>
            )}
          </div>
        )}

        {/* Visualization */}
        {message.metadata.visualization && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              <h4 className="text-lg font-semibold text-slate-800">Data Visualization</h4>
            </div>
            <ChartComponents data={message.metadata.visualization} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`message-bubble ${getBubbleClass()} mb-6 animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`rounded-2xl p-6 ${getMessageStyles()}`}>
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 p-2 rounded-xl ${
              message.type === MESSAGE_TYPES.USER ? 'bg-white/20' : 'bg-slate-100 border border-slate-200'
            }`}
          >
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm font-semibold ${
                    message.type === MESSAGE_TYPES.USER ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {message.type === MESSAGE_TYPES.USER ? 'You' : 'Assistant'}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    message.type === MESSAGE_TYPES.USER ? 'bg-white/20 text-white/80' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {formatTimestamp(message.timestamp) || 'N/A'}
                </span>
              </div>
            </div>
            <div className={`prose prose-sm max-w-none ${message.type === MESSAGE_TYPES.USER ? 'prose-invert' : ''}`}>
              <ReactMarkdown
                components={{
                  pre: ({ children }) => (
                    <pre
                      className={`${
                        message.type === MESSAGE_TYPES.USER
                          ? 'bg-white/10 border border-white/20'
                          : 'bg-slate-100 border border-slate-200'
                      } p-4 rounded-lg text-sm overflow-x-auto font-mono shadow-sm`}
                    >
                      {children}
                    </pre>
                  ),
                  code: ({ children }) => (
                    <code
                      className={`${
                        message.type === MESSAGE_TYPES.USER ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'
                      } px-2 py-1 rounded text-sm font-mono border ${
                        message.type === MESSAGE_TYPES.USER ? 'border-white/20' : 'border-slate-200'
                      }`}
                    >
                      {children}
                    </code>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`border-l-4 pl-4 my-4 ${
                        message.type === MESSAGE_TYPES.USER
                          ? 'border-white/30 text-white/90'
                          : 'border-blue-300 bg-blue-50 text-slate-700'
                      } rounded-r-lg p-3`}
                    >
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {renderMetadata()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;