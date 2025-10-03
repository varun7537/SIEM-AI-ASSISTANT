"""Blockchain utility functions"""
import hashlib
import json
from typing import Dict, Any
from datetime import datetime

def create_data_hash(data: Dict[str, Any]) -> str:
    """Create SHA-256 hash of data"""
    data_string = json.dumps(data, sort_keys=True)
    return hashlib.sha256(data_string.encode()).hexdigest()

def validate_ethereum_address(address: str) -> bool:
    """Validate Ethereum address format"""
    if not address or not isinstance(address, str):
        return False
    
    if not address.startswith('0x'):
        return False
    
    if len(address) != 42:
        return False
    
    try:
        int(address[2:], 16)
        return True
    except ValueError:
        return False

def format_transaction_data(user_id: int, action: str, details: Dict[str, Any]) -> Dict[str, Any]:
    """Format transaction data for blockchain storage"""
    return {
        "user_id": user_id,
        "action": action,
        "details": details,
        "timestamp": datetime.now().isoformat(),
        "version": "1.0"
    }

def parse_blockchain_event(event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Parse blockchain event data"""
    return {
        "tx_hash": event_data.get("transactionHash", ""),
        "block_number": event_data.get("blockNumber", 0),
        "from_address": event_data.get("from", ""),
        "timestamp": datetime.now().isoformat()
    }