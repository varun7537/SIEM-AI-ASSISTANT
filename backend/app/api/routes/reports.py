from fastapi import APIRouter, HTTPException, Depends
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from models.report_models import ReportRequest, ReportResponse, ReportType
from services.nlp_service import NLPService
from services.query_generator import QueryGenerator
from services.siem_connector import SIEMConnector
from services.response_formatter import ResponseFormatter

router = APIRouter()
logger = logging.getLogger(__name__)

async def get_report_services():
    """Get services for report generation"""
    # Same pattern as chat.py - initialize if needed
    services = {
        "nlp": NLPService(),
        "query_gen": QueryGenerator(),
        "siem": SIEMConnector(),
        "formatter": ResponseFormatter()
    }
    return services

@router.post("/reports/generate", response_model=ReportResponse)
async def generate_report(
    request: ReportRequest,
    services: Dict[str, Any] = Depends(get_report_services)
):
    """Generate a security report based on natural language request"""
    
    try:
        logger.info(f"Generating report: {request.description}")
        
        # Process request with NLP
        nlp_result = services["nlp"].process_query(request.description)
        
        # Generate appropriate query for report
        if request.report_type == ReportType.SUMMARY:
            siem_query = services["query_gen"].generate_elasticsearch_query(
                nlp_result["intent"],
                nlp_result["entities"]
            )
            # Add aggregations for summary
            siem_query.query["aggs"] = services["query_gen"]._get_statistics_aggregations()
            siem_query.size = 1000  # Get more events for comprehensive report
            
        elif request.report_type == ReportType.DETAILED:
            siem_query = services["query_gen"].generate_elasticsearch_query(
                nlp_result["intent"],
                nlp_result["entities"]
            )
            siem_query.size = 5000  # Even more events for detailed report
            
        else:  # CUSTOM
            siem_query = services["query_gen"].generate_elasticsearch_query(
                nlp_result["intent"],
                nlp_result["entities"]
            )
        
        # Execute query
        siem_response = await services["siem"].execute_query(siem_query)
        
        # Format as report
        formatted_response = services["formatter"].format_response(
            siem_response,
            nlp_result["intent"],
            request.description
        )
        
        return ReportResponse(
            title=f"Security Report - {request.description}",
            content=formatted_response["response"],
            data=formatted_response.get("data", {}),
            visualizations=formatted_response.get("visualization", []),
            generated_at=datetime.now(),
            query_used=str(siem_query.query),
            total_events=siem_response.total_hits,
            execution_time=siem_response.execution_time
        )
        
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/templates")
async def get_report_templates():
    """Get available report templates"""
    
    templates = [
        {
            "id": "security_overview",
            "name": "Security Overview",
            "description": "General security posture overview for the past 24 hours",
            "template": "Show me a security overview for the past 24 hours"
        },
        {
            "id": "failed_logins",
            "name": "Failed Login Analysis",
            "description": "Analysis of failed authentication attempts",
            "template": "Generate a report on failed login attempts in the past week"
        },
        {
            "id": "malware_detections",
            "name": "Malware Detection Report",
            "description": "Summary of malware detection events",
            "template": "Create a malware detection summary for the past month"
        },
        {
            "id": "network_anomalies",
            "name": "Network Anomaly Report",
            "description": "Network traffic anomalies and suspicious activities",
            "template": "Show me network anomalies and suspicious traffic patterns"
        },
        {
            "id": "user_activity",
            "name": "User Activity Report",
            "description": "User behavior analysis and authentication patterns",
            "template": "Generate user activity report showing authentication patterns"
        }
    ]
    
    return {"templates": templates}