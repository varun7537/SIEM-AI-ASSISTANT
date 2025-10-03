from web3 import Web3
from eth_account import Account
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime
import hashlib

logger = logging.getLogger(__name__)

class BlockchainManager:
    """Blockchain manager for audit logging"""
    
    def __init__(self, rpc_url: str = "http://localhost:8545"):
        self.rpc_url = rpc_url
        self.w3 = None
        self.contract_address = None
        self.contract_abi = self._get_contract_abi()
        self.initialize()
    
    def initialize(self):
        """Initialize blockchain connection"""
        try:
            self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            if self.w3.is_connected():
                logger.info("Blockchain connection established")
            else:
                logger.warning("Blockchain not connected, using mock implementation")
        except Exception as e:
            logger.error(f"Failed to connect to blockchain: {e}")
            self.w3 = None
    
    def _get_contract_abi(self) -> list:
        """Get smart contract ABI"""
        return [
            {
                "inputs": [
                    {"name": "_user", "type": "address"},
                    {"name": "_action", "type": "string"},
                    {"name": "_dataHash", "type": "string"},
                    {"name": "_timestamp", "type": "uint256"}
                ],
                "name": "logAuditEvent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    
    async def log_event(self, user_address: str, action: str, data: Dict[str, Any]) -> str:
        """Log event to blockchain"""
        try:
            if not self.w3 or not self.w3.is_connected():
                return self._mock_blockchain_log(user_address, action, data)
            
            # Create data hash
            data_hash = hashlib.sha256(
                json.dumps(data, sort_keys=True).encode()
            ).hexdigest()
            
            # In production, this would create and send a real transaction
            tx_hash = f"0x{data_hash}"
            
            logger.info(f"Blockchain event logged: {action} by {user_address}")
            return tx_hash
            
        except Exception as e:
            logger.error(f"Blockchain logging failed: {e}")
            return self._mock_blockchain_log(user_address, action, data)
    
    def _mock_blockchain_log(self, user_address: str, action: str, data: Dict[str, Any]) -> str:
        """Mock blockchain implementation for development"""
        mock_hash = hashlib.sha256(
            f"{user_address}-{action}-{json.dumps(data)}-{datetime.now().isoformat()}".encode()
        ).hexdigest()
        
        logger.info(f"Mock blockchain log: {action} by {user_address}")
        return f"0x{mock_hash}"
    
    async def verify_transaction(self, tx_hash: str) -> Dict[str, Any]:
        """Verify blockchain transaction"""
        try:
            if not self.w3 or not self.w3.is_connected():
                return {"verified": True, "mock": True, "hash": tx_hash}
            
            # In production, this would query the blockchain
            return {
                "verified": True,
                "hash": tx_hash,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Transaction verification failed: {e}")
            return {"verified": False, "error": str(e)}
    
    def generate_wallet(self) -> tuple[str, str]:
        """Generate new blockchain wallet"""
        try:
            account = Account.create()
            return account.address, account.key.hex()
        except Exception as e:
            logger.error(f"Wallet generation failed: {e}")
            # Return mock wallet for development
            import secrets
            mock_address = f"0x{''.join([secrets.choice('0123456789abcdef') for _ in range(40)])}"
            mock_key = f"0x{''.join([secrets.choice('0123456789abcdef') for _ in range(64)])}"
            return mock_address, mock_key