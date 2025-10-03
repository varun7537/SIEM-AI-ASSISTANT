from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime
import asyncio

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "SIEM NLP Assistant"
    }

@router.get("/health/detailed")
async def detailed_health_check():
    """Detailed health check with service status"""
    
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {}
    }
    
    try:
        # Check Elasticsearch connection
        from services.siem_connector import SIEMConnector
        siem = SIEMConnector()
        await siem.initialize()
        
        if siem.es_client and await siem.es_client.ping():
            health_status["services"]["elasticsearch"] = "healthy"
        else:
            health_status["services"]["elasticsearch"] = "unhealthy"
            health_status["status"] = "degraded"
            
        await siem.cleanup()
        
    except Exception as e:
        health_status["services"]["elasticsearch"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
    
    try:
        # Check NLP service
        from services.nlp_service import NLPService
        nlp = NLPService()
        await nlp.initialize()
        
        # Test NLP processing
        result = nlp.process_query("test query")
        if result["processed"]:
            health_status["services"]["nlp"] = "healthy"
        else:
            health_status["services"]["nlp"] = "unhealthy"
            health_status["status"] = "degraded"
            
        await nlp.cleanup()
        
    except Exception as e:
        health_status["services"]["nlp"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
    
    return health_status
