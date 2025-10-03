from fastapi import APIRouter, HTTPException, Depends
import logging
import uuid
from typing import Dict, Any

from models.chat_models import QueryRequest, QueryResponse, MessageType
from services.nlp_service import NLPService
from services.query_generator import QueryGenerator  
from services.siem_connector import SIEMConnector
from services.response_formatter import ResponseFormatter

router = APIRouter()
logger = logging.getLogger(__name__)

# Global service instances (initialized in main.py)
nlp_service: NLPService = None
query_generator: QueryGenerator = None
siem_connector: SIEMConnector = None
response_formatter: ResponseFormatter = None

async def get_services():
    """Dependency to get service instances"""
    global nlp_service, query_generator, siem_connector, context_manager, response_formatter
    
    if not all([nlp_service, query_generator, siem_connector, context_manager, response_formatter]):
        # Initialize services if not already done
        nlp_service = NLPService()
        await nlp_service.initialize()
        
        query_generator = QueryGenerator()
        
        siem_connector = SIEMConnector()
        await siem_connector.initialize()
        
        context_manager = ContextManager()
        await context_manager.initialize()
        
        response_formatter = ResponseFormatter()
    
    return {
        "nlp": nlp_service,
        "query_gen": query_generator,
        "siem": siem_connector,
        "context": context_manager,
        "formatter": response_formatter
    }

@router.post("/chat/query", response_model=QueryResponse)
async def process_chat_query(
    request: QueryRequest,
    services: Dict[str, Any] = Depends(get_services)
):
    """Process a natural language query"""
    
    try:
        logger.info(f"Processing query: {request.message}")
        
        # Generate session ID if not provided
        if not request.session_id:
            request.session_id = str(uuid.uuid4())
        
        # Add user message to context
        await services["context"].add_message(
            request.session_id,
            MessageType.USER,
            request.message
        )
        
        # Get conversation context
        context = await services["context"].get_context(request.session_id)
        
        # Process with NLP service
        nlp_result = services["nlp"].process_query(request.message, context)
        
        if not nlp_result["processed"]:
            raise HTTPException(status_code=500, detail="Failed to process natural language query")
        
        # Generate SIEM query
        siem_query = services["query_gen"].generate_elasticsearch_query(
            nlp_result["intent"],
            nlp_result["entities"],
            context
        )
        
        # Execute SIEM query
        siem_response = await services["siem"].execute_query(siem_query)
        
        # Format response for user
        formatted_response = services["formatter"].format_response(
            siem_response,
            nlp_result["intent"], 
            request.message,
            context
        )
        
        # Add assistant response to context
        await services["context"].add_message(
            request.session_id,
            MessageType.ASSISTANT,
            formatted_response["response"],
            metadata={
                "intent": nlp_result["intent"].value,
                "confidence": nlp_result["confidence"],
                "query_execution_time": siem_response.execution_time,
                "total_hits": siem_response.total_hits
            }
        )
        
        # Update context with query results
        await services["context"].update_context(request.session_id, {
            "last_query": request.message,
            "last_intent": nlp_result["intent"].value,
            "last_results_count": siem_response.total_hits,
            "entities_found": nlp_result["entities"]
        })
        
        # Generate suggestions for follow-up queries
        suggestions = generate_follow_up_suggestions(nlp_result, siem_response)
        
        return QueryResponse(
            response=formatted_response["response"],
            intent=nlp_result["intent"],
            confidence=nlp_result["confidence"],
            data=formatted_response.get("data"),
            suggestions=suggestions,
            visualization=formatted_response.get("visualization"),
            query_used=str(siem_query.query),
            execution_time=siem_response.execution_time
        )
        
    except Exception as e:
        logger.error(f"Error processing chat query: {e}")
        
        # Add error message to context
        if request.session_id:
            await services["context"].add_message(
                request.session_id,
                MessageType.ERROR,
                f"Error processing query: {str(e)}"
            )
        
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )

@router.get("/chat/history/{session_id}")
async def get_chat_history(
    session_id: str,
    limit: int = 20,
    services: Dict[str, Any] = Depends(get_services)
):
    """Get chat history for a session"""
    
    try:
        history = await services["context"].get_conversation_history(session_id, limit)
        
        return {
            "session_id": session_id,
            "messages": [
                {
                    "id": msg.id,
                    "type": msg.type.value,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat(),
                    "metadata": msg.metadata
                }
                for msg in history
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/context/{session_id}")
async def update_chat_context(
    session_id: str,
    context_updates: Dict[str, Any],
    services: Dict[str, Any] = Depends(get_services)
):
    """Update context for a chat session"""
    
    try:
        await services["context"].update_context(session_id, context_updates)
        return {"status": "Context updated successfully"}
        
    except Exception as e:
        logger.error(f"Error updating context: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/chat/session/{session_id}")
async def clear_chat_session(
    session_id: str,
    services: Dict[str, Any] = Depends(get_services)
):
    """Clear a chat session"""
    
    try:
        # Create new empty session
        await services["context"].create_session(session_id)
        return {"status": "Session cleared successfully"}
        
    except Exception as e:
        logger.error(f"Error clearing session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_follow_up_suggestions(nlp_result: Dict[str, Any], siem_response) -> list[str]:
    """Generate contextual follow-up query suggestions"""
    
    suggestions = []
    intent = nlp_result["intent"]
    entities = nlp_result["entities"]
    
    # Intent-based suggestions
    if intent.value == "search_logs":
        suggestions.extend([
            "Show me only high severity events from these results",
            "Generate a report for these findings", 
            "What are the top source IPs in these events?"
        ])
    elif intent.value == "get_statistics":
        suggestions.extend([
            "Show me the detailed events behind these statistics",
            "Create a timeline view of these events",
            "Filter these by specific time range"
        ])
    
    # Entity-based suggestions
    ip_entities = [e for e in entities if e.get("type") == "ip_address"]
    if ip_entities:
        ip = ip_entities[0]["value"]
        suggestions.append(f"Show all events from IP {ip}")
        suggestions.append(f"What other IPs communicated with {ip}?")
    
    user_entities = [e for e in entities if e.get("type") == "username"]
    if user_entities:
        user = user_entities[0]["value"]
        suggestions.append(f"Show login history for user {user}")
        suggestions.append(f"What systems did {user} access?")
    
    # Results-based suggestions
    if siem_response.total_hits > 100:
        suggestions.append("Filter these results to show only the most critical events")
    elif siem_response.total_hits == 0:
        suggestions.append("Try expanding the time range for this search")
        suggestions.append("Search for similar events in the past week")
    
    return suggestions[:5]  # Return top 5 suggestions