import React, { useState } from 'react'
import { FileText, Download, Calendar, Filter } from 'lucide-react'
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
    <div className="space-y-6">
      {/* Report Generation Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Generate Security Report
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value)
                if (e.target.value) setCustomDescription('')
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Custom Report</option>
              {REPORT_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        
        {/* Custom Description */}
        {!selectedTemplate && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Report Description
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Describe what you want in the report..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
        
        {/* Generate Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || (!selectedTemplate && !customDescription.trim())}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Generated Report */}
      {generatedReport && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Report Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{generatedReport.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Generated on {new Date(generatedReport.generated_at).toLocaleString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadReport('text')}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => handleDownloadReport('json')}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>JSON</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Report Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <ReactMarkdown>{generatedReport.content}</ReactMarkdown>
            </div>
            
            {/* Visualizations */}
            {generatedReport.visualizations && generatedReport.visualizations.length > 0 && (
              <div className="mt-6 space-y-4">
                {generatedReport.visualizations.map((viz, index) => (
                  <ChartComponents key={index} data={viz} />
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