import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Eye, 
  Brain,
  Target,
  Zap,
  RefreshCw,
  Download,
  BarChart2,
  AlertCircle
} from 'lucide-react';
import { aiAnalysisAPI } from '../../services/api';
import ChartComponents from '../Reports/ChartComponents';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

// Sample data for testing/demo purposes
const sampleDashboardData = {
  overall_risk_score: 75,
  total_events: 1250,
  active_threats: 12,
  detection_rate: 92,
  threat_trends: {
    timestamps: [
      '2025-10-03 00:00',
      '2025-10-03 06:00',
      '2025-10-03 12:00',
      '2025-10-03 18:00',
      '2025-10-04 00:00'
    ],
    values: [45, 60, 75, 70, 65]
  },
  threat_categories: {
    'Malware': 35,
    'Phishing': 25,
    'DDoS': 15,
    'Unauthorized Access': 20,
    'Data Leak': 5
  },
  recent_threats: [
    {
      timestamp: '2025-10-03T23:45:00Z',
      type: 'Malware',
      severity: 85,
      source: '192.168.1.100',
      status: 'Active'
    },
    {
      timestamp: '2025-10-03T22:30:00Z',
      type: 'Phishing',
      severity: 60,
      source: 'external.email@domain.com',
      status: 'Mitigated'
    },
    {
      timestamp: '2025-10-03T21:15:00Z',
      type: 'DDoS',
      severity: 45,
      source: '172.16.0.0/16',
      status: 'Monitoring'
    },
    {
      timestamp: '2025-10-03T20:00:00Z',
      type: 'Unauthorized Access',
      severity: 70,
      source: '10.0.0.50',
      status: 'Active'
    }
  ]
};

const AIThreatDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
      
      let interval;
      if (autoRefresh) {
        interval = setInterval(loadDashboardData, 60000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [autoRefresh, selectedTimeRange, isAuthenticated]);

  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      let data;
      try {
        data = await aiAnalysisAPI.getThreatDashboard({ timeRange: selectedTimeRange });
      } catch (apiError) {
        // Fallback to sample data if API fails
        data = sampleDashboardData;
      }
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeRange]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadDashboardData();
  };

  const handleExport = () => {
    if (dashboardData) {
      const exportData = JSON.stringify(dashboardData, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `threat_dashboard_${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getRiskLevelColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100 border-red-200';
    if (score >= 60) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getRiskLevelText = (score) => {
    if (score >= 80) return 'Critical Risk';
    if (score >= 60) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <div className="text-center">
  //         <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
  //         <p className="text-red-600 font-medium">Authentication Required</p>
  //         <p className="text-gray-600 mt-2">Please log in to view the AI Threat Dashboard</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (isLoading && !dashboardData) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <div className="text-center">
  //         <LoadingSpinner size="xl" />
  //         <p className="mt-4 text-gray-600">Loading AI threat analysis...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error && !dashboardData) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <div className="text-center">
  //         <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
  //         <p className="text-red-600 font-medium">Failed to load threat dashboard</p>
  //         <p className="text-gray-600 mt-2">{error}</p>
  //         <button
  //           onClick={handleRefresh}
  //           className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-60"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Threat Intelligence Dashboard</h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span>Real-time threat analysis powered by machine learning</span>
              </p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="1h">Last 1 Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
            </select>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                Auto-refresh
              </label>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Risk Overview Cards */}
        {dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Overall Risk Score */}
              <div className={`p-6 rounded-xl border-2 backdrop-blur-sm ${getRiskLevelColor(dashboardData.overall_risk_score)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Overall Risk Score</p>
                    <p className="text-3xl font-bold">{Math.round(dashboardData.overall_risk_score)}</p>
                    <p className="text-sm mt-1">{getRiskLevelText(dashboardData.overall_risk_score)}</p>
                  </div>
                  <Shield className="h-12 w-12 opacity-60" />
                </div>
              </div>

              {/* Total Events */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Events ({selectedTimeRange})</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.total_events?.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Active monitoring
                    </p>
                  </div>
                  <Activity className="h-12 w-12 text-blue-500 opacity-60" />
                </div>
              </div>

              {/* Active Threats */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Threats</p>
                    <p className="text-3xl font-bold text-red-600">{dashboardData.active_threats}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <Target className="h-3 w-3 inline mr-1" />
                      Ongoing analysis
                    </p>
                  </div>
                  <Target className="h-12 w-12 text-red-500 opacity-60" />
                </div>
              </div>

              {/* Detection Rate */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Detection Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.detection_rate}%</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <Eye className="h-3 w-3 inline mr-1" />
                      ML model accuracy
                    </p>
                  </div>
                  <Eye className="h-12 w-12 text-purple-500 opacity-60" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Threat Trends Over Time</h2>
                <ChartComponents
                  type={chartType}
                  data={dashboardData.threat_trends}
                  options={{
                    xAxis: { data: dashboardData.threat_trends?.timestamps },
                    yAxis: { type: 'value' },
                    series: [{ data: dashboardData.threat_trends?.values, type: chartType }],
                  }}
                />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Threat Category Distribution</h2>
                <ChartComponents
                  type="pie"
                  data={dashboardData.threat_categories}
                  options={{
                    series: [{
                      type: 'pie',
                      data: Object.entries(dashboardData.threat_categories || {}).map(([name, value]) => ({
                        name,
                        value,
                      })),
                    }],
                  }}
                />
              </div>
            </div>

            {/* Threat Details Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Threat Events</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Timestamp</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Threat Type</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Severity</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Source</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recent_threats?.map((threat, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(threat.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{threat.type}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(threat.severity)}`}>
                            {getRiskLevelText(threat.severity)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{threat.source}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{threat.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIThreatDashboard;