"""API routes package initialization"""
from api.routes import (
    chat,
    reports,
    health,
    auth,
    ai_analysis,
    blockchain,
    collaboration
)

__all__ = [
    "chat",
    "reports",
    "health",
    "auth",
    "ai_analysis",
    "blockchain",
    "collaboration"
]