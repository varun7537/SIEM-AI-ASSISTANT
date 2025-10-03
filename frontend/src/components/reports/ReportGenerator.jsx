import React, { useState } from 'react'
import { FileText, Download, Calendar, Filter, Sparkles, TrendingUp, Clock } from 'lucide-react'
import { reportsAPI } from '../../services/api'
import { REPORT_TEMPLATES } from '../../utils/constants'
import LoadingSpinner from '../Common/LoadingSpinner'

const ReportGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [reportType, setReportType] = useState('summary')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState(null)
  
  const handleGenerateReport = async () => {
    const description = selectedTemplate 
      ? REPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.query 
      : customDescription
    
    if (!description.trim()) return
    
    setIsGenerating(true)
    try {
      const report = await reportsAPI.generateReport(description, reportType)
      setGeneratedReport(report)
    } catch (error) {
      console.error('Error generating report:', error)
      // Handle error appropriately
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleDownloadReport = (format) => {
    if (!generatedReport) return
    
    const filename = `security-report-${Date.now()}`
    
    if (format === 'json') {
      downloadJSON(generatedReport, filename)
    } else if (format === 'text') {
      const blob = new Blob([generatedReport.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-2">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Security Report Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create comprehensive security reports with AI-powered insights and analytics
        </p>
      </div>

      {/* Report Generation Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Configure Your Report</h2>
              <p className="text-sm text-gray-600 mt-0.5">Select a template or create a custom report</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Template and Type Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                Report Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value)
                  if (e.target.value) setCustomDescription('')
                }}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-medium hover:bg-gray-100 cursor-pointer"
              >
                <option value="">✨ Custom Report</option>
                {REPORT_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Report Type */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-medium hover:bg-gray-100 cursor-pointer"
              >
                <option value="summary">📋 Summary</option>
                <option value="detailed">📊 Detailed</option>
                <option value="custom">⚙️ Custom</option>
              </select>
            </div>
          </div>
          
          {/* Custom Description */}
          {!selectedTemplate && (
            <div className="space-y-2 animate-fadeIn">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                Custom Report Description
              </label>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe what you want in the report... (e.g., 'Analyze security incidents from the last 30 days with threat analysis')"
                rows={4}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Be specific about time ranges, data types, and analysis requirements
              </p>
            </div>
          )}
          
          {/* Generate Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
              Report generation typically takes 10-30 seconds
            </p>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || (!selectedTemplate && !customDescription.trim())}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner />
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Generated Report */}
      {generatedReport && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{generatedReport.title}</h3>
                  <p className="text-sm text-gray-600 mt-1.5 flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Generated on {new Date(generatedReport.generated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleDownloadReport('text')}
                  className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => handleDownloadReport('json')}
                  className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>JSON</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Report Content */}
          <div className="p-8">
            <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown>{generatedReport.content}</ReactMarkdown>
            </div>
            
            {/* Visualizations */}
            {generatedReport.visualizations && generatedReport.visualizations.length > 0 && (
              <div className="mt-8 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Data Visualizations</h4>
                </div>
                {generatedReport.visualizations.map((viz, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <ChartComponents data={viz} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportGenerator