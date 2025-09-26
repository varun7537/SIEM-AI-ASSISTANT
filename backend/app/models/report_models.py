from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ReportType(str, Enum):
    SUMMARY = "summary"
    DETAILED = "detailed"
    CUSTOM = "custom"

class ReportRequest(BaseModel):
    description: str
    report_type: ReportType = ReportType.SUMMARY
    time_range: Optional[Dict[str, str]] = None
    filters: Optional[Dict[str, Any]] = None
    include_charts: bool = True

class ReportResponse(BaseModel):
    title: str
    content: str
    data: Dict[str, Any]
    visualizations: Optional[List[Dict[str, Any]]] = None
    generated_at: datetime
    query_used: Optional[str] = None
    total_events: int = 0
    execution_time: float = 0.0