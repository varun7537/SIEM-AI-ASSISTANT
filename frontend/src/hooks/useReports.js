import { useState, useCallback } from 'react';
import { reportsAPI } from '../services/api';

export const useReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);

  const generateReport = useCallback(async (description, reportType = 'summary') => {
    if (!description || typeof description !== 'string') {
      const errorMsg = 'Invalid description provided';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsGenerating(true);
    setError(null);

    try {
      const report = await reportsAPI.generateReport(description, reportType);
      if (!report) {
        throw new Error('No report data returned from API');
      }
      return report;
    } catch (err) {
      const errorMsg = err.message || 'Failed to generate report';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const loadTemplates = useCallback(async () => {
    setIsLoadingTemplates(true);
    setError(null);

    try {
      const response = await reportsAPI.getReportTemplates();
      if (!response || !Array.isArray(response.templates)) {
        throw new Error('Invalid templates data returned from API');
      }
      setTemplates(response.templates);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load templates';
      setError(errorMsg);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, []);

  return {
    isGenerating,
    isLoadingTemplates,
    error,
    templates,
    generateReport,
    loadTemplates
  };
};