import { useState, useCallback } from 'react'
import { reportsAPI } from '../services/api'

export const useReports = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [templates, setTemplates] = useState([])
  
  const generateReport = useCallback(async (description, reportType = 'summary') => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const report = await reportsAPI.generateReport(description, reportType)
      return report
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])
  
  const loadTemplates = useCallback(async () => {
    try {
      const response = await reportsAPI.getReportTemplates()
      setTemplates(response.templates || [])
    } catch (err) {
      setError(err.message)
    }
  }, [])
  
  return {
    isGenerating,
    error,
    templates,
    generateReport,
    loadTemplates
  }
}