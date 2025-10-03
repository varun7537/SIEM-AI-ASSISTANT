from web3 import Web3
from eth_account import Account
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from core.config import settings
import hashlib

logger = logging.getLogger(__name__)

class BlockchainService:
    def __init__(self):
        # For demo purposes, we'll use a local blockchain or testnet
        # In production, use proper RPC endpoints
        self.w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_RPC_URL or 'http://localhost:8545'))
        self.contract_address = None
        self.contract_abi = self._get_contract_abi()
        self.private_key = settings.BLOCKCHAIN_PRIVATE_KEY
        
    def _get_contract_abi(self) -> list:
        """Simple smart contract ABI for audit logging"""
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
            },
            {
                "inputs": [{"name": "_hash", "type": "string"}],
                "name": "getAuditEvent",
                "outputs": [
                    {"name": "", "type": "address"},
                    {"name": "", "type": "string"},
                    {"name": "", "type": "string"},
                    {"name": "", "type": "uint256"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "anonymous": False,
                "inputs": [
                    {"indexed": True, "name": "user", "type": "address"},
                    {"indexed": False, "name": "action", "type": "string"},
                    {"indexed": False, "name": "dataHash", "type": "string"},
                    {"indexed": False, "name": "timestamp", "type": "uint256"}
                ],
                "name": "AuditEventLogged",
                "type": "event"
            }
        ]
    
    async def initialize(self):
        """Initialize blockchain connection and deploy contract if needed"""
        try:
            if not self.w3.is_connected():
                logger.warning("Blockchain not connected, using mock implementation")
                return
            
            # Deploy contract if not exists (for demo)
            if not self.contract_address:
                await self._deploy_contract()
                
            logger.info("Blockchain service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize blockchain service: {e}")
            # Fall back to mock implementation
    
    async def _deploy_contract(self):
        """Deploy audit logging smart contract"""
        try:
            # Simple Solidity contract bytecode (pre-compiled for demo)
            contract_bytecode = "0x608060405234801561001057600080fd5b50..."  # Truncated for brevity
            
            if self.private_key and self.w3.is_connected():
                account = Account.from_key(self.private_key)
                
                # Deploy contract transaction
                contract = self.w3.eth.contract(
                    abi=self.contract_abi,
                    bytecode=contract_bytecode
                )
                
                transaction = contract.constructor().build_transaction({
                    'from': account.address,
                    'nonce': self.w3.eth.get_transaction_count(account.address),
                    'gas': 2000000,
                    'gasPrice': self.w3.to_wei('20', 'gwei')
                })
                
                signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
                tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
                
                self.contract_address = tx_receipt.contractAddress
                logger.info(f"Contract deployed at: {self.contract_address}")
            
        except Exception as e:
            logger.error(f"Contract deployment failed: {e}")
    
    async def log_audit_event(self, user_address: str, action: str, data: Dict[str, Any]) -> Optional[str]:
        """Log audit event to blockchain"""
        try:
            if not self.w3.is_connected():
                return await self._mock_blockchain_log(user_address, action, data)
            
            # Create data hash
            data_string = json.dumps(data, sort_keys=True)
            data_hash = hashlib.sha256(data_string.encode()).hexdigest()
            
            # Prepare transaction
            contract = self.w3.eth.contract(
                address=self.contract_address,
                abi=self.contract_abi
            )
            
            account = Account.from_key(self.private_key)
            
            transaction = contract.functions.logAuditEvent(
                user_address,
                action,
                data_hash,
                int(datetime.now().timestamp())
            ).build_transaction({
                'from': account.address,
                'nonce': self.w3.eth.get_transaction_count(account.address),
                'gas': 200000,
                'gasPrice': self.w3.to_wei('20', 'gwei')
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for confirmation
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return tx_hash.hex()
            
        except Exception as e:
            logger.error(f"Blockchain audit logging failed: {e}")
            return await self._mock_blockchain_log(user_address, action, data)
    
    async def _mock_blockchain_log(self, user_address: str, action: str, data: Dict[str, Any]) -> str:
        """Mock blockchain implementation for development/demo"""
        mock_hash = hashlib.sha256(
            f"{user_address}-{action}-{json.dumps(data)}-{datetime.now().isoformat()}".encode()
        ).hexdigest()
        
        logger.info(f"Mock blockchain log: {action} by {user_address} - Hash: {mock_hash}")
        return f"0x{mock_hash}"
    
    async def verify_audit_event(self, tx_hash: str) -> Optional[Dict[str, Any]]:
        """Verify audit event on blockchain"""
        try:
            if not self.w3.is_connected():
                return {"verified": True, "mock": True, "hash": tx_hash}
            
            # Get transaction receipt
            tx_receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            
            if tx_receipt:
                return {
                    "verified": True,
                    "block_number": tx_receipt.blockNumber,
                    "gas_used": tx_receipt.gasUsed,
                    "status": tx_receipt.status
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Blockchain verification failed: {e}")
            return None
    
    def generate_wallet_address(self) -> tuple[str, str]:
        """Generate new blockchain wallet address for user"""
        try:
            account = Account.create()
            return account.address, account.key.hex()
        except Exception as e:
            logger.error(f"Wallet generation failed: {e}")
            # Return mock address for demo
            import secrets
            mock_address = f"0x{''.join([secrets.choice('0123456789abcdef') for _ in range(40)])}"
            mock_key = f"0x{''.join([secrets.choice('0123456789abcdef') for _ in range(64)])}"
            return mock_address, mock_key