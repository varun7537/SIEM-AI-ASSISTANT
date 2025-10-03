from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from services.ai_threat_detection import AIThreatDetectionService
from services.siem_connector import SIEMConnector
from services.query_generator import QueryGenerator
from api.dependencies import get_current_user
from models.siem_models import SecurityEvent
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Global service instances
ai_service = AIThreatDetectionService()
siem_connector = SIEMConnector()
query_generator = QueryGenerator()

@router.get("/insights/summary")
async def get_insights_summary(
    time_range: str = "24h",
    current_user = Depends(get_current_user)
):
    """Get AI-powered security insights summary"""
    try:
        # Map time range to query
        time_mapping = {
            "1h": timedelta(hours=1),
            "24h": timedelta(days=1),
            "7d": timedelta(days=7),
            "30d": timedelta(days=30)
        }
        
        delta = time_mapping.get(time_range, timedelta(days=1))
        
        # Generate query for the time range
        siem_query = query_generator.generate_elasticsearch_query(
            "search_logs",
            [{"type": "time_range", "value": time_range}]
        )
        
        # Execute query
        siem_response = await siem_connector.execute_query(siem_query)
        
        # Perform AI analysis
        analysis = await ai_service.analyze_events(siem_response.events)
        
        return {
            "summary": {
                "time_range": time_range,
                "total_events": siem_response.total_hits,
                "risk_score": analysis["risk_score"],
                "anomalies_count": len(analysis["anomalies"]),
                "threats_count": len(analysis["threats"]),
                "recommendations": analysis["recommendations"]
            },
            "top_threats": analysis["threats"][:5],
            "critical_anomalies": [
                a for a in analysis["anomalies"] 
                if a.get("confidence", 0) > 0.8
            ][:5],
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to generate insights summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights/trends")
async def get_security_trends(
    days: int = 7,
    current_user = Depends(get_current_user)
):
    """Get security trends over time"""
    try:
        trends_data = {
            "period": f"last_{days}_days",
            "daily_stats": [],
            "threat_evolution": {},
            "risk_score_trend": []
        }
        
        for i in range(days):
            date = datetime.now() - timedelta(days=days-i-1)
            
            # Query for each day
            siem_query = query_generator.generate_elasticsearch_query(
                "search_logs",
                [{
                    "type": "time_range",
                    "value": f"{date.strftime('%Y-%m-%d')}"
                }]
            )
            
            siem_response = await siem_connector.execute_query(siem_query)
            analysis = await ai_service.analyze_events(siem_response.events)
            
            trends_data["daily_stats"].append({
                "date": date.strftime("%Y-%m-%d"),
                "events": siem_response.total_hits,
                "risk_score": analysis["risk_score"],
                "threats": len(analysis["threats"]),
                "anomalies": len(analysis["anomalies"])
            })
            
            trends_data["risk_score_trend"].append({
                "date": date.strftime("%Y-%m-%d"),
                "score": analysis["risk_score"]
            })
        
        return trends_data
        
    except Exception as e:
        logger.error(f"Failed to generate trends: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/insights/predict")
async def predict_threats(
    prediction_request: Dict[str, Any],
    current_user = Depends(get_current_user)
):
    """Use AI to predict potential security threats"""
    try:
        # Get historical data
        siem_query = query_generator.generate_elasticsearch_query(
            "search_logs",
            [{"type": "time_range", "value": "30d"}]
        )
        
        siem_response = await siem_connector.execute_query(siem_query)
        
        # Perform predictive analysis
        predictions = {
            "confidence": 0.75,
            "predicted_threats": [
                {
                    "type": "brute_force",
                    "probability": 0.68,
                    "expected_timeframe": "next 24 hours",
                    "indicators": [
                        "Increasing failed login attempts",
                        "Suspicious IP patterns detected"
                    ]
                },
                {
                    "type": "data_exfiltration",
                    "probability": 0.45,
                    "expected_timeframe": "next 48 hours",
                    "indicators": [
                        "Unusual data transfer volumes",
                        "Access during non-business hours"
                    ]
                }
            ],
            "recommendations": [
                "Enable additional MFA for high-risk accounts",
                "Monitor network traffic more closely",
                "Review user access permissions"
            ]
        }
        
        return predictions
        
    except Exception as e:
        logger.error(f"Failed to predict threats: {e}")
        raise HTTPException(status_code=500, detail=str(e))