from typing import Dict, Any, List, Optional
from datetime import datetime
import asyncio
import json
from models.chat_models import ChatSession
from services.context_manager import ContextManager

class CollaborativeInvestigationService:
    """Real-time collaborative investigation platform"""
    
    def __init__(self, context_manager: ContextManager):
        self.context_manager = context_manager
        self.active_investigations = {}  # investigation_id -> investigation_data
        self.investigation_participants = {}  # investigation_id -> [user_ids]
        self.investigation_timeline = {}  # investigation_id -> [timeline_events]
        
    async def create_investigation(self, creator_id: str, title: str, description: str) -> str:
        """Create a new collaborative investigation"""
        investigation_id = f"inv_{int(datetime.now().timestamp())}_{creator_id}"
        
        investigation = {
            "id": investigation_id,
            "title": title,
            "description": description,
            "creator_id": creator_id,
            "created_at": datetime.now().isoformat(),
            "status": "active",
            "priority": "medium",
            "tags": [],
            "evidence": [],
            "findings": [],
            "shared_queries": [],
            "collaborative_notes": []
        }
        
        self.active_investigations[investigation_id] = investigation
        self.investigation_participants[investigation_id] = [creator_id]
        self.investigation_timeline[investigation_id] = [{
            "timestamp": datetime.now().isoformat(),
            "user_id": creator_id,
            "action": "created_investigation",
            "details": {"title": title, "description": description}
        }]
        
        return investigation_id
    
    async def join_investigation(self, investigation_id: str, user_id: str) -> bool:
        """Add user to collaborative investigation"""
        if investigation_id not in self.active_investigations:
            return False
        
        if user_id not in self.investigation_participants[investigation_id]:
            self.investigation_participants[investigation_id].append(user_id)
            
            # Add to timeline
            self.investigation_timeline[investigation_id].append({
                "timestamp": datetime.now().isoformat(),
                "user_id": user_id,
                "action": "joined_investigation",
                "details": {}
            })
        
        return True
    
    async def share_query_result(self, investigation_id: str, user_id: str, query: str, results: Dict[str, Any]) -> bool:
        """Share query results with investigation team"""
        if investigation_id not in self.active_investigations:
            return False
        
        shared_query = {
            "id": f"query_{len(self.active_investigations[investigation_id]['shared_queries'])}",
            "user_id": user_id,
            "query": query,
            "results_summary": {
                "total_events": results.get('data', {}).get('total_hits', 0),
                "event_types": list(results.get('data', {}).get('summary', {}).get('event_types', {}).keys()),
                "time_range": results.get('data', {}).get('summary', {}).get('time_range', {})
            },
            "full_results": results,
            "timestamp": datetime.now().isoformat(),
            "annotations": []
        }
        
        self.active_investigations[investigation_id]['shared_queries'].append(shared_query)
        
        # Add to timeline
        self.investigation_timeline[investigation_id].append({
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "action": "added_evidence",
            "details": {"title": evidence_item["title"], "type": evidence_item["type"]}
        })
        
        return True
    
    async def add_collaborative_note(self, investigation_id: str, user_id: str, note: str) -> bool:
        """Add collaborative note to investigation"""
        if investigation_id not in self.active_investigations:
            return False
        
        note_item = {
            "id": f"note_{len(self.active_investigations[investigation_id]['collaborative_notes'])}",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "content": note,
            "tags": [],
            "replies": []
        }
        
        self.active_investigations[investigation_id]['collaborative_notes'].append(note_item)
        
        return True
    
    async def get_investigation_summary(self, investigation_id: str) -> Optional[Dict[str, Any]]:
        """Get comprehensive investigation summary"""
        if investigation_id not in self.active_investigations:
            return None
        
        investigation = self.active_investigations[investigation_id]
        
        return {
            "investigation": investigation,
            "participants": self.investigation_participants[investigation_id],
            "timeline": self.investigation_timeline[investigation_id],
            "stats": {
                "total_queries": len(investigation["shared_queries"]),
                "total_evidence": len(investigation["evidence"]),
                "total_notes": len(investigation["collaborative_notes"]),
                "duration_hours": self._calculate_investigation_duration(investigation_id)
            }
        }
    
    def _calculate_investigation_duration(self, investigation_id: str) -> float:
        """Calculate investigation duration in hours"""
        if investigation_id not in self.investigation_timeline:
            return 0
        
        timeline = self.investigation_timeline[investigation_id]
        if not timeline:
            return 0
        
        start_time = datetime.fromisoformat(timeline[0]["timestamp"])
        end_time = datetime.fromisoformat(timeline[-1]["timestamp"])
        
        return (end_time - start_time).total_seconds() / 3600