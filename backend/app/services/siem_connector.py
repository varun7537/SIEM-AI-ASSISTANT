import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import json
from models.siem_models import SIEMQuery, EntityType
from models.chat_models import QueryIntent
from utils.query_templates import ELASTICSEARCH_TEMPLATES, KQL_TEMPLATES

logger = logging.getLogger(__name__)

class SIEMConnector:
    def __init__(self):
        self.connected = False

    def connect(self):
        """Establish a connection to the SIEM system."""
        try:
            # Simulate a successful connection (replace with actual connection logic)
            self.connected = True
            logger.info("Successfully connected to SIEM system.")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to SIEM system: {e}")
            return False

    def get_data(self):
        """Fetch data from the SIEM system."""
        if self.connected:
            # Simulate fetching data (replace with actual data retrieval)
            return {"status": "connected", "data": []}
        else:
            logger.error("SIEM system is not connected.")
            return {"status": "not connected"}

class QueryGenerator:
    def __init__(self):
        self.index_mappings = {
            "security_events": "winlogbeat-*",
            "network_logs": "packetbeat-*",
            "system_logs": "metricbeat-*",
            "web_logs": "filebeat-*",
            "wazuh_alerts": "wazuh-alerts-*",
            "default": "logs-*"
        }
    
    def generate_elasticsearch_query(
        self, 
        intent: QueryIntent,
        entities: List[Dict[str, Any]],
        context: Dict[str, Any] = None
    ) -> SIEMQuery:
        """Generate Elasticsearch DSL query based on intent and entities"""
        
        try:
            query_body = {"query": {"bool": {"must": []}}}
            
            # Base time filter (default: last 24 hours)
            time_range = self._extract_time_range(entities)
            if time_range:
                query_body["query"]["bool"]["filter"] = [{
                    "range": {
                        "@timestamp": {
                            "gte": time_range["start"],
                            "lte": time_range["end"]
                        }
                    }
                }]
            
            # Add entity-based filters
            must_clauses = []
            
            for entity in entities:
                entity_type = entity.get("type")
                entity_value = entity.get("value")
                
                if entity_type == EntityType.IP_ADDRESS.value:
                    must_clauses.append({
                        "bool": {
                            "should": [
                                {"match": {"source.ip": entity_value}},
                                {"match": {"destination.ip": entity_value}},
                                {"match": {"client.ip": entity_value}},
                                {"match": {"server.ip": entity_value}}
                            ]
                        }
                    })
                
                elif entity_type == EntityType.USERNAME.value:
                    must_clauses.append({
                        "bool": {
                            "should": [
                                {"match": {"user.name": entity_value}},
                                {"match": {"user.id": entity_value}},
                                {"match": {"winlog.event_data.TargetUserName": entity_value}}
                            ]
                        }
                    })
                
                elif entity_type == EntityType.HOSTNAME.value:
                    must_clauses.append({
                        "bool": {
                            "should": [
                                {"match": {"host.name": entity_value}},
                                {"match": {"host.hostname": entity_value}},
                                {"match": {"agent.hostname": entity_value}}
                            ]
                        }
                    })
            
            # Intent-specific modifications
            if intent == QueryIntent.SEARCH_LOGS:
                # Add general security event filters
                must_clauses.extend(self._get_security_filters())
                
            elif intent == QueryIntent.GET_STATISTICS:
                # Add aggregations for statistics
                query_body["aggs"] = self._get_statistics_aggregations()
                query_body["size"] = 0  # Only return aggregations
                
            # Apply must clauses
            if must_clauses:
                query_body["query"]["bool"]["must"].extend(must_clauses)
            
            # Default sorting
            query_body["sort"] = [{"@timestamp": {"order": "desc"}}]
            
            # Determine index pattern
            index_pattern = self._determine_index_pattern(intent, entities)
            
            return SIEMQuery(
                query_type="elasticsearch_dsl",
                query=query_body,
                index_pattern=index_pattern,
                size=100
            )
            
        except Exception as e:
            logger.error(f"Error generating Elasticsearch query: {e}")
            # Return a basic query as fallback
            return SIEMQuery(
                query_type="elasticsearch_dsl",
                query={"query": {"match_all": {}}},
                index_pattern="logs-*",
                size=10
            )
    
    def generate_kql_query(
        self,
        intent: QueryIntent,
        entities: List[Dict[str, Any]],
        context: Dict[str, Any] = None
    ) -> str:
        """Generate KQL (Kibana Query Language) query"""
        
        kql_parts = []
        
        # Add entity-based filters
        for entity in entities:
            entity_type = entity.get("type")
            entity_value = entity.get("value")
            
            if entity_type == EntityType.IP_ADDRESS.value:
                kql_parts.append(f"(source.ip:{entity_value} OR destination.ip:{entity_value})")
                
            elif entity_type == EntityType.USERNAME.value:
                kql_parts.append(f"user.name:{entity_value}")
                
            elif entity_type == EntityType.HOSTNAME.value:
                kql_parts.append(f"host.name:{entity_value}")
        
        # Intent-specific additions
        if intent == QueryIntent.SEARCH_LOGS:
            # Add security-related filters
            security_filters = [
                "event.category:authentication",
                "event.category:network", 
                "event.category:malware"
            ]
            kql_parts.append(f"({' OR '.join(security_filters)})")
        
        # Combine with AND
        kql_query = " AND ".join(kql_parts) if kql_parts else "*"
        
        return kql_query
    
    def _extract_time_range(self, entities: List[Dict[str, Any]]) -> Optional[Dict[str, str]]:
        """Extract time range from entities"""
        
        for entity in entities:
            if entity.get("type") == EntityType.TIME_RANGE.value:
                value = entity.get("value", "").lower()
                
                if "yesterday" in value or "last 24 hours" in value:
                    end_time = datetime.now()
                    start_time = end_time - timedelta(days=1)
                    
                elif "last week" in value or "past week" in value:
                    end_time = datetime.now()
                    start_time = end_time - timedelta(weeks=1)
                    
                elif "last month" in value or "past month" in value:
                    end_time = datetime.now()
                    start_time = end_time - timedelta(days=30)
                    
                elif "today" in value:
                    end_time = datetime.now()
                    start_time = end_time.replace(hour=0, minute=0, second=0, microsecond=0)
                    
                else:
                    # Default: last hour
                    end_time = datetime.now()
                    start_time = end_time - timedelta(hours=1)
                
                return {
                    "start": start_time.isoformat(),
                    "end": end_time.isoformat()
                }
        
        # Default time range: last 24 hours
        end_time = datetime.now()
        start_time = end_time - timedelta(days=1)
        return {
            "start": start_time.isoformat(),
            "end": end_time.isoformat()
        }
    
    def _get_security_filters(self) -> List[Dict[str, Any]]:
        """Get common security event filters"""
        return [
            {
                "bool": {
                    "should": [
                        {"match": {"event.category": "authentication"}},
                        {"match": {"event.category": "network"}},
                        {"match": {"event.category": "malware"}},
                        {"match": {"event.category": "intrusion_detection"}},
                        {"range": {"event.risk_score": {"gte": 21}}}
                    ]
                }
            }
        ]
    
    def _get_statistics_aggregations(self) -> Dict[str, Any]:
        """Get aggregations for statistics queries"""
        return {
            "event_types": {
                "terms": {
                    "field": "event.category.keyword",
                    "size": 10
                }
            },
            "top_source_ips": {
                "terms": {
                    "field": "source.ip.keyword",
                    "size": 10
                }
            },
            "events_over_time": {
                "date_histogram": {
                    "field": "@timestamp",
                    "calendar_interval": "1h"
                }
            },
            "severity_distribution": {
                "terms": {
                    "field": "event.severity.keyword",
                    "size": 5
                }
            }
        }
    
    def _determine_index_pattern(self, intent: QueryIntent, entities: List[Dict[str, Any]]) -> str:
        """Determine the appropriate index pattern based on intent and entities"""
        
        # Check for specific mentions in entities that might indicate log type
        for entity in entities:
            value = entity.get("value", "").lower()
            if "wazuh" in value or "ossec" in value:
                return self.index_mappings["wazuh_alerts"]
            elif "network" in value or "firewall" in value:
                return self.index_mappings["network_logs"]
            elif "web" in value or "apache" in value or "nginx" in value:
                return self.index_mappings["web_logs"]
        
        # Default based on intent
        if intent in [QueryIntent.SEARCH_LOGS, QueryIntent.GENERATE_REPORT]:
            return self.index_mappings["security_events"]
        
        return self.index_mappings["default"]