from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MessageType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    ERROR = "error"

class QueryIntent(str, Enum):
    SEARCH_LOGS = "search_logs"
    GENERATE_REPORT = "generate_report"
    GET_STATISTICS = "get_statistics"
    FILTER_RESULTS = "filter_results"
    CLARIFICATION = "clarification"
    UNKNOWN = "unknown"

class ChatMessage(BaseModel):
    id: str
    type: MessageType
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class QueryRequest(BaseModel):
    message: str
    session_id: str
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class QueryResponse(BaseModel):
    response: str
    intent: QueryIntent
    confidence: float
    data: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None
    visualization: Optional[Dict[str, Any]] = None
    query_used: Optional[str] = None
    execution_time: Optional[float] = None

class ChatSession(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    messages: List[ChatMessage] = []
    context: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime