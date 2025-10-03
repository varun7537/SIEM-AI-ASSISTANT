from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import logging
from contextlib import asynccontextmanager
from core.config import settings
from core.logging import setup_logging
from api.routes import chat, reports, health
from services.nlp_service import NLPService

# Global instances
nlp_service = None
context_manager = None

# If ContextManager is not already defined, we define it here
class ContextManager:
    """Context Manager class for handling various resources or states."""
    async def initialize(self):
        logging.info("Initializing context manager...")
        # Add any setup code for your context manager here
        await self.setup_resources()

    async def cleanup(self):
        logging.info("Cleaning up context manager...")
        # Add any teardown code for your context manager here
        await self.release_resources()

    async def setup_resources(self):
        # Resource setup logic (e.g., databases, files, etc.)
        logging.info("Setting up resources.")

    async def release_resources(self):
        # Resource cleanup logic
        logging.info("Releasing resources.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global nlp_service, context_manager
    
    # Startup
    setup_logging()
    logging.info("Starting SIEM NLP Assistant...")

    # Initialize services
    nlp_service = NLPService()
    await nlp_service.initialize()

    context_manager = ContextManager()
    await context_manager.initialize()

    logging.info("All services initialized successfully")

    yield

    # Shutdown
    logging.info("Shutting down SIEM NLP Assistant...")
    await nlp_service.cleanup()
    await context_manager.cleanup()


app = FastAPI(
    title="SIEM NLP Assistant",
    description="Conversational SIEM Assistant for Investigation and Automated Threat Reporting",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(reports.router, prefix="/api", tags=["reports"])

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.user_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: str = None):
        self.active_connections.remove(websocket)
        if user_id and user_id in self.user_connections:
            del self.user_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.user_connections:
            await self.user_connections[user_id].send_text(message)


manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Process WebSocket messages here
            await manager.send_personal_message(f"Echo: {data}", user_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
