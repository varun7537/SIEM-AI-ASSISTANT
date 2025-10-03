"""API package initialization"""
from fastapi import APIRouter

api_router = APIRouter()

# Import and include all route modules
from api.routes import chat, reports, health, auth, ai_analysis, blockchain, collaboration

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(ai_analysis.router, prefix="/ai-analysis", tags=["ai-analysis"])
api_router.include_router(blockchain.router, prefix="/blockchain", tags=["blockchain"])
api_router.include_router(collaboration.router, prefix="/collaboration", tags=["collaboration"])
