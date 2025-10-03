import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, UserPlus, MessageSquare, FileText, Info } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';

// Mock useCollaboration hook for demonstration purposes
const useCollaboration = () => {
  const [updates, setUpdates] = useState([
    {
      id: 'update_1',
      type: 'user_joined',
      title: 'New Team Member',
      message: 'Alice Johnson joined the investigation',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'update_2',
      type: 'message',
      title: 'New Note Added',
      message: 'Bob Smith added a new note to the investigation',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'update_3',
      type: 'evidence',
      title: 'New Evidence Uploaded',
      message: 'Carol Williams uploaded new log files',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'update_4',
      type: 'query_shared',
      title: 'Query Shared',
      message: 'David Brown shared a new query: Suspicious IP analysis',
      timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      read: false,
    },
  ]);

  const markAsRead = (updateId) => {
    setUpdates((prev) =>
      prev.map((update) =>
        update.id === updateId ? { ...update, read: true } : update
      )
    );
  };

  const clearUpdate = (updateId) => {
    setUpdates((prev) => prev.filter((update) => update.id !== updateId));
  };

  return { updates, markAsRead, clearUpdate };
};

const RealTimeUpdates = () => {
  const { updates, markAsRead, clearUpdate } = useCollaboration();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = updates.filter((u) => !u.read).length;
    setUnreadCount(unread);
  }, [updates]);

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'user_joined':
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'evidence':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'query_shared':
        return <Info className="h-5 w-5 text-indigo-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleMarkAsRead = (updateId) => {
    markAsRead(updateId);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Real-Time Updates</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Updates List */}
            <div className="flex-1 overflow-y-auto">
              {updates.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !update.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getUpdateIcon(update.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {update.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {update.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatRelativeTime(update.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!update.read && (
                            <button
                              onClick={() => handleMarkAsRead(update.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => clearUpdate(update.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            title="Clear"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No new updates</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {updates.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    updates.forEach((u) => markAsRead(u.id));
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RealTimeUpdates;