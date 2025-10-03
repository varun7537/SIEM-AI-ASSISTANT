from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class SIEMType(str, Enum):
    ELASTIC = "elastic"

class LogLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class SecurityEvent(BaseModel):
    id: str
    timestamp: datetime
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    user: Optional[str] = None
    event_type: str
    severity: LogLevel
    description: str
    rule_id: Optional[str] = None
    raw_log: Optional[str] = None
    metadata: Dict[str, Any] = {}

class SIEMQuery(BaseModel):
    query_type: str  # elasticsearch_dsl, kql, etc.
    query: Dict[str, Any]
    index_pattern: str
    time_range: Optional[Dict[str, str]] = None
    size: int = 100

class SIEMResponse(BaseModel):
    total_hits: int
    events: List[SecurityEvent]
    aggregations: Optional[Dict[str, Any]] = None
    execution_time: float
    query_metadata: Optional[Dict[str, Any]] = None

class EntityType(str, Enum):
    IP_ADDRESS = "ip_address"
    USERNAME = "username"
    HOSTNAME = "hostname"
    FILE_PATH = "file_path"
    PROCESS = "process"
    TIME_RANGE = "time_range"
    RULE_ID = "rule_id"
    PORT = "port"

class ExtractedEntity(BaseModel):
    type: EntityType
    value: str
    confidence: float
    start_pos: int
    end_pos: int
