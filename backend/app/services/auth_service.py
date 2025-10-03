import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import uuid
from datetime import datetime

from core.security import security_manager
from models.auth_models import UserCreate, UserLogin, UserResponse, TokenResponse
from database.models import User
from database.connection import get_db

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self):
        self.security = security_manager
    
    async def register_user(self, user_data: UserCreate, db: Session) -> TokenResponse:
        """Register a new user"""
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = self.security.get_password_hash(user_data.password)
        
        db_user = User(
            id=str(uuid.uuid4()),
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            role=user_data.role,
            department=user_data.department,
            is_active=True,
            created_at=datetime.utcnow(),
            blockchain_address=self._generate_blockchain_address(user_data.email),
            api_key=self.security.generate_api_key(user_data.email)
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Generate tokens
        access_token = self.security.create_access_token({"sub": db_user.email, "user_id": db_user.id})
        refresh_token = self.security.create_refresh_token({"sub": db_user.email, "user_id": db_user.id})
        
        user_response = UserResponse(
            id=db_user.id,
            email=db_user.email,
            full_name=db_user.full_name,
            role=db_user.role,
            department=db_user.department,
            is_active=db_user.is_active,
            created_at=db_user.created_at,
            blockchain_address=db_user.blockchain_address,
            api_key=db_user.api_key
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
    
    async def authenticate_user(self, login_data: UserLogin, db: Session) -> TokenResponse:
        """Authenticate user and return tokens"""
        
        # Find user
        db_user = db.query(User).filter(User.email == login_data.email).first()
        
        if not db_user or not self.security.verify_password(login_data.password, db_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not db_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Update last login
        db_user.last_login = datetime.utcnow()
        db.commit()
        
        # Generate tokens
        access_token = self.security.create_access_token({"sub": db_user.email, "user_id": db_user.id})
        refresh_token = self.security.create_refresh_token({"sub": db_user.email, "user_id": db_user.id})
        
        user_response = UserResponse(
            id=db_user.id,
            email=db_user.email,
            full_name=db_user.full_name,
            role=db_user.role,
            department=db_user.department,
            is_active=db_user.is_active,
            created_at=db_user.created_at,
            last_login=db_user.last_login,
            blockchain_address=db_user.blockchain_address,
            api_key=db_user.api_key
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )
    
    async def refresh_access_token(self, refresh_token: str, db: Session) -> TokenResponse:
        """Refresh access token using refresh token"""
        
        try:
            payload = self.security.verify_token(refresh_token, "refresh")
            email = payload.get("sub")
            
            if not email:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            db_user = db.query(User).filter(User.email == email).first()
            if not db_user or not db_user.is_active:
                raise HTTPException(status_code=401, detail="User not found or inactive")
            
            # Generate new tokens
            access_token = self.security.create_access_token({"sub": db_user.email, "user_id": db_user.id})
            new_refresh_token = self.security.create_refresh_token({"sub": db_user.email, "user_id": db_user.id})
            
            user_response = UserResponse(
                id=db_user.id,
                email=db_user.email,
                full_name=db_user.full_name,
                role=db_user.role,
                department=db_user.department,
                is_active=db_user.is_active,
                created_at=db_user.created_at,
                last_login=db_user.last_login,
                blockchain_address=db_user.blockchain_address
            )
            
            return TokenResponse(
                access_token=access_token,
                refresh_token=new_refresh_token,
                user=user_response
            )
            
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    def _generate_blockchain_address(self, email: str) -> str:
        """Generate a unique blockchain address for the user"""
        import hashlib
        hash_object = hashlib.sha256(f"siem_{email}_{datetime.utcnow()}".encode())
        return f"0x{hash_object.hexdigest()[:40]}"