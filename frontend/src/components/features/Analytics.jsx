import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Target,
  Download,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Plot from 'react-plotly.js'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [metrics, setMetrics] = useState({
    totalQueries: 1247,
    averageResponseTime: 1.8,
    threatsDetected: 23,
    anomaliesFound: 15
  })

  const [chartData, setChartData] = useState({
    queriesOverTime: {
      data: [
        {
          x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          y: [120, 180, 145, 200, 165, 95, 110],
          type: 'bar',
          marker: { 
            color: '#3b82f6',
            line: { width: 0 }
          },
          hovertemplate: '<b>%{x}</b><br>Queries: %{y}<extra></extra>'
        }
      ],
      layout: {
        title: { 
          text: 'Queries Over Time',
          font: { size: 16, color: '#1f2937', family: 'Inter, system-ui, sans-serif' }
        },
        xaxis: { 
          title: 'Day',
          gridcolor: '#f3f4f6'
        },
        yaxis: { 
          title: 'Query Count',
          gridcolor: '#f3f4f6'
        },
        height: 320,
        margin: { t: 50, r: 20, b: 50, l: 50 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      }
    },
    threatDistribution: {
      data: [
        {
          labels: ['Brute Force', 'Malware', 'Data Exfiltration', 'Privilege Escalation'],
          values: [35, 28, 22, 15],
          type: 'pie',
          marker: {
            colors: ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6']
          },
          textposition: 'inside',
          textinfo: 'label+percent',
          hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
        }
      ],
      layout: {
        title: { 
          text: 'Threat Distribution',
          font: { size: 16, color: '#1f2937', family: 'Inter, system-ui, sans-serif' }
        },
        height: 320,
        margin: { t: 50, r: 20, b: 20, l: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        showlegend: true,
        legend: { orientation: 'h', y: -0.1 }
      }
    },
    responseTimesTrend: {
      data: [
        {
          x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          y: [1.5, 1.8, 1.6, 2.1, 1.9, 1.4, 1.7],
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#10b981', width: 3, shape: 'spline' },
          marker: { size: 8, color: '#10b981' },
          fill: 'tozeroy',
          fillcolor: 'rgba(16, 185, 129, 0.1)',
          hovertemplate: '<b>%{x}</b><br>Response Time: %{y}s<extra></extra>'
        }
      ],
      layout: {
        title: { 
          text: 'Average Response Time (seconds)',
          font: { size: 16, color: '#1f2937', family: 'Inter, system-ui, sans-serif' }
        },
        xaxis: { 
          title: 'Day',
          gridcolor: '#f3f4f6'
        },
        yaxis: { 
          title: 'Time (s)',
          gridcolor: '#f3f4f6'
        },
        height: 350,
        margin: { t: 50, r: 20, b: 50, l: 50 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      }
    }
  })

  const handleExport = () => {
    console.log('Exporting analytics data...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2 ml-1">Comprehensive insights into system performance and security metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all cursor-pointer appearance-none font-medium text-gray-700"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <button
              onClick={handleExport}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="bg-green-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Queries</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalQueries.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">vs last week</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="bg-green-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ArrowDown className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">0.3s</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.averageResponseTime}s</p>
              <p className="text-xs text-gray-500 mt-2">Improved performance</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-red-50 p-3 rounded-xl group-hover:bg-red-100 transition-colors">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <div className="bg-red-50 px-2.5 py-1 rounded-lg">
                <span className="text-xs font-semibold text-red-600">High</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Threats Detected</p>
              <p className="text-3xl font-bold text-red-600">{metrics.threatsDetected}</p>
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Requires attention
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-amber-50 p-3 rounded-xl group-hover:bg-amber-100 transition-colors">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="bg-amber-50 px-2.5 py-1 rounded-lg">
                <span className="text-xs font-semibold text-amber-600">Medium</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Anomalies Found</p>
              <p className="text-3xl font-bold text-amber-600">{metrics.anomaliesFound}</p>
              <p className="text-xs text-gray-500 mt-2">In last {timeRange}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Queries Over Time */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition-all">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Query Activity
              </h3>
            </div>
            <Plot
              data={chartData.queriesOverTime.data}
              layout={chartData.queriesOverTime.layout}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%' }}
            />
          </div>

          {/* Threat Distribution */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition-all">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                Security Threats
              </h3>
            </div>
            <Plot
              data={chartData.threatDistribution.data}
              layout={chartData.threatDistribution.layout}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%' }}
            />
          </div>

          {/* Response Times Trend */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 lg:col-span-2 transition-all">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                Performance Metrics
              </h3>
            </div>
            <Plot
              data={chartData.responseTimesTrend.data}
              layout={{ ...chartData.responseTimesTrend.layout, height: 350 }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Top Queries */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              Top Queries
            </h2>
            <p className="text-sm text-gray-600 mt-1">Most frequently executed queries this period</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { query: 'Show me failed login attempts', count: 342, trend: '+15%' },
                { query: 'Generate security report', count: 287, trend: '+8%' },
                { query: 'What malware was detected', count: 198, trend: '+22%' },
                { query: 'Find suspicious network activity', count: 156, trend: '-5%' },
                { query: 'Show authentication failures', count: 134, trend: '+12%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all border border-gray-100 group hover:border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md group-hover:shadow-lg transition-all">
                      <span className="text-lg font-bold text-white">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.query}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.count.toLocaleString()} executions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-sm ${
                      item.trend.startsWith('+') 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.trend.startsWith('+') ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )}
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics