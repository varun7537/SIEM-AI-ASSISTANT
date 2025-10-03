import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, XCircle, Shield, User, Settings, Bell, Search, HelpCircle, Clock } from 'lucide-react';
import { healthAPI } from '../../services/api';

const Header = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        const health = await healthAPI.detailedHealthCheck();
        setHealthStatus(health);
        setError(null);
      } catch (error) {
        console.error('Health check failed:', error);
        setHealthStatus({ status: 'error' });
        setError('Failed to fetch system status. Please try again later.');
      }
    };

    checkSystemHealth();
    const healthInterval = setInterval(checkSystemHealth, 60000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400 animate-pulse" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'degraded':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'All Systems Operational';
      case 'degraded':
        return 'Performance Degraded';
      case 'error':
        return 'System Error Detected';
      default:
        return 'Checking Status...';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and Title Section */}
        <div className="flex items-center group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              SIEM NLP Assistant
            </h1>
            <p className="text-sm text-slate-500 font-medium">Conversational Security Investigation</p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 group"
            >
              <Search className="h-5 w-5 text-slate-600 group-hover:text-slate-800" />
            </button>
            {showSearch && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search alerts, logs, or incidents..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center">
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl border transition-all duration-300 ${getStatusColor(healthStatus?.status)}`}>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthStatus?.status)}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                    System Status
                  </span>
                  <span className="text-sm font-medium">
                    {getStatusText(healthStatus?.status)}
                  </span>
                </div>
              </div>
              {healthStatus?.status === 'healthy' && (
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </div>

          {/* Time Display */}
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <a href="/realtimeupdates">
              <button className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 group">
                <Bell className="h-5 w-5 text-slate-600 group-hover:text-slate-800" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
            </a>
          </div>

          {/* Help/Support */}
          <div className="relative">
            <a href="/support">
              <button className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 group">
                <HelpCircle className="h-5 w-5 text-slate-600 group-hover:text-slate-800" />
              </button>
            </a>
          </div>

          {/* Settings */}
          <div className="relative">
            <button className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 group">
              <Settings className="h-5 w-5 text-slate-600 group-hover:text-slate-800 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 group"
            >
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800">Security Analyst</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">Security Analyst</p>
                  <p className="text-xs text-slate-500">analyst@company.com</p>
                </div>
                <div className="py-2">
                  <a href="/profile" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150">
                    <User className="h-4 w-4 mr-3 text-slate-400" />
                    Profile
                  </a>
                  <a href="/preferences" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150">
                    <Settings className="h-4 w-4 mr-3 text-slate-400" />
                    Preferences
                  </a>
                  <a href="/audit-logs" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150">
                    <Activity className="h-4 w-4 mr-3 text-slate-400" />
                    Audit Logs
                  </a>
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150">
                      <XCircle className="h-4 w-4 mr-3" />
                      Sign Out
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Status Details and Error Handling */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Error</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {healthStatus?.status === 'error' && !error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">System Alert</p>
              <p className="text-xs text-red-600">
                Critical services are experiencing issues. Please check system logs.
              </p>
            </div>
          </div>
        </div>
      )}

      {healthStatus?.status === 'degraded' && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Performance Notice</p>
              <p className="text-xs text-amber-600">
                Some services are running slower than expected. Our team is investigating.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;