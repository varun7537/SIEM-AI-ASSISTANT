import logging
import json
import aioredis
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from app.core.config import settings
from app.models.chat_models import ChatSession, ChatMessage, MessageType

logger = logging.getLogger(__name__)

class ContextManager:
    def __init__(self):
        self.redis_client = None
        self.sessions: Dict[str, ChatSession] = {}  # In-memory fallback
        self.session_timeout = 3600  # 1 hour
    
    async def initialize(self):
        """Initialize context manager"""
        try:
            logger.info("Initializing context manager...")
            
            # Try to connect to Redis
            try:
                self.redis_client = await aioredis.from_url(
                    f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
                    decode_responses=True
                )
                
                # Test connection
                await self.redis_client.ping()
                logger.info("Redis connection established for context management")
                
            except Exception as e:
                logger.warning(f"Redis connection failed, using in-memory storage: {e}")
                self.redis_client = None
            
            logger.info("Context manager initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize context manager: {e}")
            raise
    
    async def cleanup(self):
        """Cleanup context manager"""
        if self.redis_client:
            await self.redis_client.close()
    
    async def create_session(self, session_id: str, user_id: Optional[str] = None) -> ChatSession:
        """Create a new chat session"""
        session = ChatSession(
            session_id=session_id,
            user_id=user_id,
            messages=[],
            context={},
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        await self._save_session(session)
        return session
    
    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Get an existing chat session"""
        try:
            if self.redis_client:
                session_data = await self.redis_client.get(f"session:{session_id}")
                if session_data:
                    data = json.loads(session_data)
                    return ChatSession(**data)
            else:
                return self.sessions.get(session_id)
            
        except Exception as e:
            logger.error(f"Error getting session {session_id}: {e}")
        
        return None
    
    async def update_session(self, session: ChatSession):
        """Update an existing chat session"""
        session.updated_at = datetime.now()
        await self._save_session(session)
    
    async def add_message(self, session_id: str, message_type: MessageType, content: str, metadata: Dict[str, Any] = None) -> ChatMessage:
        """Add a message to a session"""
        session = await self.get_session(session_id)
        if not session:
            session = await self.create_session(session_id)
        
        message = ChatMessage(
            id=f"{session_id}_{len(session.messages)}_{datetime.now().timestamp()}",
            type=message_type,
            content=content,
            timestamp=datetime.now(),
            metadata=metadata or {}
        )
        
        session.messages.append(message)
        await self.update_session(session)
        
        return message
    
    async def get_context(self, session_id: str) -> Dict[str, Any]:
        """Get context for a session"""
        session = await self.get_session(session_id)
        if session:
            context = session.context.copy()
            
            # Add recent messages to context
            recent_messages = session.messages[-5:]  # Last 5 messages
            context["recent_messages"] = [
                {
                    "type": msg.type.value,
                    "content": msg.content[:200],  # Truncate long messages
                    "timestamp": msg.timestamp.isoformat()
                }
                for msg in recent_messages
            ]
            
            # Add conversation summary
            context["message_count"] = len(session.messages)
            context["session_duration"] = (datetime.now() - session.created_at).total_seconds()
            
            return context
        
        return {}
    
    async def update_context(self, session_id: str, context_updates: Dict[str, Any]):
        """Update context for a session"""
        session = await self.get_session(session_id)
        if session:
            session.context.update(context_updates)
            await self.update_session(session)
    
    async def get_conversation_history(self, session_id: str, limit: int = 10) -> List[ChatMessage]:
        """Get conversation history for a session"""
        session = await self.get_session(session_id)
        if session:
            return session.messages[-limit:]
        return []
    
    async def clean_expired_sessions(self):
        """Clean up expired sessions"""
        try:
            current_time = datetime.now()
            expired_sessions = []
            
            if self.redis_client:
                # Get all session keys
                keys = await self.redis_client.keys("session:*")
                
                for key in keys:
                    session_data = await self.redis_client.get(key)
                    if session_data:
                        data = json.loads(session_data)
                        updated_at = datetime.fromisoformat(data["updated_at"])
                        
                        if (current_time - updated_at).total_seconds() > self.session_timeout:
                            expired_sessions.append(key)
                
                # Delete expired sessions
                if expired_sessions:
                    await self.redis_client.delete(*expired_sessions)
                    logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
            
            else:
                # Clean in-memory sessions
                for session_id, session in list(self.sessions.items()):
                    if (current_time - session.updated_at).total_seconds() > self.session_timeout:
                        expired_sessions.append(session_id)
                
                for session_id in expired_sessions:
                    del self.sessions[session_id]
                
                if expired_sessions:
                    logger.info(f"Cleaned up {len(expired_sessions)} expired in-memory sessions")
                    
        except Exception as e:
            logger.error(f"Error cleaning expired sessions: {e}")
    
    async def _save_session(self, session: ChatSession):
        """Save session to storage"""
        try:
            if self.redis_client:
                # Save to Redis with expiration
                session_data = session.json()
                await self.redis_client.setex(
                    f"session:{session.session_id}",
                    self.session_timeout,
                    session_data
                )
            else:
                # Save to in-memory storage
                self.sessions[session.session_id] = session
                
        except Exception as e:
            logger.error(f"Error saving session {session.session_id}: {e}")
            # Fallback to in-memory
            self.sessions[session.session_id] = session
