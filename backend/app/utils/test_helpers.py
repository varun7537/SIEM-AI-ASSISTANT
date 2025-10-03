"""Test helper utilities"""
from typing import Dict, Any
from datetime import datetime
from models.siem_models import SecurityEvent, LogLevel

def create_mock_security_event(**kwargs) -> SecurityEvent:
    """Create mock security event for testing"""
    defaults = {
        "id": "test_event_1",
        "timestamp": datetime.now(),
        "event_type": "authentication",
        "severity": LogLevel.MEDIUM,
        "description": "Test security event",
        "source_ip": "192.168.1.100",
        "destination_ip": "10.0.0.1",
        "user": "test_user",
        "rule_id": "rule_001",
        "metadata": {}
    }
    defaults.update(kwargs)
    return SecurityEvent(**defaults)

def create_mock_user_data(**kwargs) -> Dict[str, Any]:
    """Create mock user data for testing"""
    defaults = {
        "id": 1,
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "is_active": True,
        "blockchain_address": "0x1234567890123456789012345678901234567890"
    }
    defaults.update(kwargs)
    return defaults

def create_mock_jwt_token(user_data: Dict[str, Any]) -> str:
    """Create mock JWT token for testing"""
    from app.core.security import create_access_token
    return create_access_token(subject=user_data["username"])

def create_mock_siem_response(event_count: int = 10) -> Dict[str, Any]:
    """Create mock SIEM response for testing"""
    events = [create_mock_security_event(id=f"event_{i}") for i in range(event_count)]
    
    return {
        "total_hits": event_count,
        "events": events,
        "execution_time": 0.5,
        "aggregations": {
            "event_types": {
                "buckets": [
                    {"key": "authentication", "doc_count": 5},
                    {"key": "network", "doc_count": 3},
                    {"key": "malware", "doc_count": 2}
                ]
            }
        }
    }

# app/__init__.py
"""SIEM NLP Assistant Application"""
__version__ = "2.0.0"
__author__ = "SIEM Development Team"
__description__ = "Conversational SIEM Assistant with AI, Blockchain, and Collaboration"