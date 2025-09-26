export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ERROR: 'error'
}

export const QUERY_INTENTS = {
  SEARCH_LOGS: 'search_logs',
  GENERATE_REPORT: 'generate_report',
  GET_STATISTICS: 'get_statistics',
  FILTER_RESULTS: 'filter_results',
  CLARIFICATION: 'clarification',
  UNKNOWN: 'unknown'
}

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.LOW]: 'text-green-600 bg-green-100',
  [SEVERITY_LEVELS.MEDIUM]: 'text-yellow-600 bg-yellow-100',
  [SEVERITY_LEVELS.HIGH]: 'text-orange-600 bg-orange-100',
  [SEVERITY_LEVELS.CRITICAL]: 'text-red-600 bg-red-100'
}

export const EXAMPLE_QUERIES = [
  "Show me failed login attempts from yesterday",
  "Generate a security report for the past week",
  "What malware detections occurred in the last 24 hours?",
  "Find suspicious network activity from IP 192.168.1.100",
  "Show me authentication failures for user admin",
  "Create a summary of high severity events",
  "What are the top source IPs in security events?"
]

export const REPORT_TEMPLATES = [
  {
    id: 'security_overview',
    name: 'Security Overview',
    description: 'Comprehensive security posture overview',
    query: 'Generate a security overview report for the past 24 hours'
  },
  {
    id: 'failed_logins',
    name: 'Failed Login Analysis',
    description: 'Analysis of failed authentication attempts',
    query: 'Show me failed login attempts analysis for the past week'
  },
  {
    id: 'malware_detections',
    name: 'Malware Detection Report',
    description: 'Malware and threat detection summary',
    query: 'Create a malware detection report for the past month'
  },
  {
    id: 'network_anomalies',
    name: 'Network Anomalies',
    description: 'Network traffic anomalies and suspicious activities',
    query: 'Generate network anomaly report showing suspicious traffic patterns'
  }
]