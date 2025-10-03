from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List, Optional
from datetime import datetime
from core.blockchain import BlockchainManager
from api.dependencies import get_current_user
from database.connection import get_db
from sqlalchemy.orm import Session
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Global blockchain manager
blockchain_manager = BlockchainManager()

@router.get("/audit-history")
async def get_audit_history(
    limit: int = 50,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get blockchain audit history for current user"""
    try:
        from database.models import AuditLog
        
        audit_logs = db.query(AuditLog)\
            .filter(AuditLog.user_id == current_user["user_id"])\
            .order_by(AuditLog.timestamp.desc())\
            .limit(limit)\
            .all()
        
        return [
            {
                "id": log.id,
                "action": log.action,
                "resource": log.resource,
                "timestamp": log.timestamp.isoformat(),
                "blockchain_hash": log.blockchain_hash,
                "ip_address": log.ip_address
            }
            for log in audit_logs
        ]
        
    except Exception as e:
        logger.error(f"Failed to get audit history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
async def verify_transaction(
    request: Dict[str, str],
    current_user = Depends(get_current_user)
):
    """Verify a blockchain transaction"""
    try:
        tx_hash = request.get("tx_hash")
        if not tx_hash:
            raise HTTPException(status_code=400, detail="Transaction hash is required")
        
        verification = await blockchain_manager.verify_transaction(tx_hash)
        
        return {
            "verified": verification["verified"],
            "transaction_hash": tx_hash,
            "block_number": verification.get("block_number"),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Transaction verification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_blockchain_stats(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get blockchain statistics"""
    try:
        from database.models import AuditLog, User
        
        # Get user's transaction count
        user_tx_count = db.query(AuditLog)\
            .filter(AuditLog.user_id == current_user["user_id"])\
            .count()
        
        # Get total verified events
        verified_count = db.query(AuditLog)\
            .filter(AuditLog.blockchain_hash.isnot(None))\
            .count()
        
        # Get user's blockchain address
        user = db.query(User).filter(User.id == current_user["user_id"]).first()
        
        return {
            "totalTransactions": user_tx_count,
            "verifiedEvents": verified_count,
            "blockchainAddress": user.blockchain_address if user else None,
            "gasUsed": user_tx_count * 21000,  # Mock calculation
            "lastUpdate": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get blockchain stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions")
async def get_transaction_history(
    limit: int = 20,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get transaction history"""
    try:
        from database.models import AuditLog
        
        transactions = db.query(AuditLog)\
            .filter(AuditLog.user_id == current_user["user_id"])\
            .filter(AuditLog.blockchain_hash.isnot(None))\
            .order_by(AuditLog.timestamp.desc())\
            .limit(limit)\
            .all()
        
        return [
            {
                "hash": log.blockchain_hash,
                "action": log.action,
                "timestamp": log.timestamp.isoformat(),
                "blockNumber": "Confirmed",
                "status": "confirmed",
                "gasUsed": 21000
            }
            for log in transactions
        ]
        
    except Exception as e:
        logger.error(f"Failed to get transactions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions/{tx_hash}")
async def get_transaction_details(
    tx_hash: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed transaction information"""
    try:
        from database.models import AuditLog
        
        transaction = db.query(AuditLog)\
            .filter(AuditLog.blockchain_hash == tx_hash)\
            .first()
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {
            "hash": transaction.blockchain_hash,
            "blockNumber": "Confirmed",
            "timestamp": transaction.timestamp.isoformat(),
            "from": transaction.user.blockchain_address if transaction.user else "Unknown",
            "action": transaction.action,
            "gasUsed": 21000,
            "status": "confirmed",
            "data": {
                "resource": transaction.resource,
                "ip_address": transaction.ip_address
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get transaction details: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/wallet")
async def get_user_wallet(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's blockchain wallet information"""
    try:
        from database.models import User
        
        user = db.query(User).filter(User.id == current_user["user_id"]).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "address": user.blockchain_address,
            "created_at": user.created_at.isoformat(),
            "transaction_count": db.query(AuditLog)\
                .filter(AuditLog.user_id == user.id)\
                .count()
        }
        
    except Exception as e:
        logger.error(f"Failed to get wallet info: {e}")
        raise HTTPException(status_code=500, detail=str(e))