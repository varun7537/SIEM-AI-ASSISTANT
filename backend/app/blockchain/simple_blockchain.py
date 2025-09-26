import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
import threading
import logging

logger = logging.getLogger(__name__)

class Block:
    def __init__(self, index: int, transactions: List[Dict], previous_hash: str, timestamp: Optional[datetime] = None):
        self.index = index
        self.timestamp = timestamp or datetime.utcnow()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Calculate the hash of the block"""
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp.isoformat(),
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty: int = 4):
        """Mine the block using proof of work"""
        target = "0" * difficulty
        
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
        
        logger.info(f"Block mined: {self.hash}")
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp.isoformat(),
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
            "hash": self.hash
        }

class SecurityBlockchain:
    def __init__(self):
        self.chain: List[Block] = []
        self.difficulty = 4
        self.pending_transactions: List[Dict] = []
        self.mining_reward = 1
        self.lock = threading.Lock()
        
        # Create genesis block
        self.create_genesis_block()
    
    def create_genesis_block(self):
        """Create the first block in the blockchain"""
        genesis_block = Block(0, [], "0")
        genesis_block.mine_block(self.difficulty)
        self.chain.append(genesis_block)
    
    def get_latest_block(self) -> Block:
        """Get the latest block in the chain"""
        return self.chain[-1]
    
    def add_transaction(self, transaction: Dict[str, Any]) -> str:
        """Add a transaction to pending transactions"""
        with self.lock:
            # Add timestamp and ID to transaction
            transaction["timestamp"] = datetime.utcnow().isoformat()
            transaction["id"] = hashlib.sha256(json.dumps(transaction, sort_keys=True).encode()).hexdigest()
            
            self.pending_transactions.append(transaction)
            return transaction["id"]
    
    def mine_pending_transactions(self, mining_reward_address: str) -> Block:
        """Mine pending transactions into a new block"""
        with self.lock:
            # Add mining reward transaction
            reward_transaction = {
                "type": "mining_reward",
                "to_address": mining_reward_address,
                "amount": self.mining_reward,
                "timestamp": datetime.utcnow().isoformat()
            }
            self.pending_transactions.append(reward_transaction)
            
            # Create new block
            block = Block(
                len(self.chain),
                self.pending_transactions,
                self.get_latest_block().hash
            )
            
            # Mine the block
            block.mine_block(self.difficulty)
            
            # Add block to chain and clear pending transactions
            self.chain.append(block)
            self.pending_transactions = []
            
            return block
    
    def is_chain_valid(self) -> bool:
        """Validate the entire blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Check if current block hash is valid
            if current_block.hash != current_block.calculate_hash():
                return False
            
            # Check if current block points to previous block
            if current_block.previous_hash != previous_block.hash:
                return False
        
        return True
    
    def get_security_events(self, user_address: str) -> List[Dict]:
        """Get all security events for a user"""
        events = []
        
        for block in self.chain:
            for transaction in block.transactions:
                if (transaction.get("user_address") == user_address or 
                    transaction.get("analyst_address") == user_address):
                    events.append({
                        **transaction,
                        "block_index": block.index,
                        "block_hash": block.hash
                    })
        
        return events
    
    def get_chain_stats(self) -> Dict[str, Any]:
        """Get blockchain statistics"""
        total_transactions = sum(len(block.transactions) for block in self.chain)
        
        return {
            "total_blocks": len(self.chain),
            "total_transactions": total_transactions,
            "pending_transactions": len(self.pending_transactions),
            "difficulty": self.difficulty,
            "latest_block_hash": self.get_latest_block().hash,
            "is_valid": self.is_chain_valid()
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert blockchain to dictionary"""
        return {
            "chain": [block.to_dict() for block in self.chain],
            "pending_transactions": self.pending_transactions,
            "stats": self.get_chain_stats()
        }

# Global blockchain instance
security_blockchain = SecurityBlockchain()
