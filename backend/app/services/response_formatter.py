import logging
from typing import Dict, Any, List, Optional
import json
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder
from models.siem_models import SIEMResponse, SecurityEvent
from models.chat_models import QueryIntent

logger = logging.getLogger(__name__)

class ResponseFormatter:
    def __init__(self):
        self.max_events_display = 20
    
    def format_response(
        self, 
        siem_response: SIEMResponse, 
        intent: QueryIntent, 
        query: str,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Format SIEM response for user consumption"""
        
        try:
            if intent == QueryIntent.SEARCH_LOGS:
                return self._format_search_response(siem_response, query)
            
            elif intent == QueryIntent.GENERATE_REPORT:
                return self._format_report_response(siem_response, query)
            
            elif intent == QueryIntent.GET_STATISTICS:
                return self._format_statistics_response(siem_response, query)
            
            else:
                return self._format_generic_response(siem_response, query)
                
        except Exception as e:
            logger.error(f"Error formatting response: {e}")
            return {
                "response": f"I encountered an error while processing the results: {str(e)}",
                "data": None,
                "visualization": None
            }
    
    def _format_search_response(self, siem_response: SIEMResponse, query: str) -> Dict[str, Any]:
        """Format search query results"""
        
        total_hits = siem_response.total_hits
        events = siem_response.events[:self.max_events_display]
        
        if total_hits == 0:
            return {
                "response": f"No security events found matching your query: '{query}'. You might want to try a broader search or check a different time range.",
                "data": {"events": []},
                "visualization": None
            }
        
        # Create response text
        response_text = f"Found {total_hits} security events"
        if total_hits > self.max_events_display:
            response_text += f" (showing first {self.max_events_display})"
        response_text += f" matching your query.\n\n"
        
        # Add event summaries
        event_summaries = []
        for event in events[:5]:  # Show details for first 5 events
            summary = f"• **{event.timestamp.strftime('%Y-%m-%d %H:%M:%S')}** - {event.description}"
            if event.source_ip:
                summary += f" (Source: {event.source_ip})"
            if event.severity:
                summary += f" [**{event.severity.value.upper()}**]"
            event_summaries.append(summary)
        
        if event_summaries:
            response_text += "\n".join(event_summaries)
            if len(events) > 5:
                response_text += f"\n\n... and {len(events) - 5} more events."
        
        # Create visualization
        visualization = self._create_timeline_chart(events)
        
        return {
            "response": response_text,
            "data": {
                "total_hits": total_hits,
                "events": [self._event_to_dict(event) for event in events],
                "summary": self._create_events_summary(events)
            },
            "visualization": visualization
        }
    
    def _format_report_response(self, siem_response: SIEMResponse, query: str) -> Dict[str, Any]:
        """Format report generation results"""
        
        events = siem_response.events
        aggregations = siem_response.aggregations or {}
        
        # Generate report narrative
        report_text = f"# Security Report\n\n"
        report_text += f"**Query:** {query}\n"
        report_text += f"**Generated:** {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # Summary statistics
        report_text += f"## Summary\n\n"
        report_text += f"- **Total Events:** {siem_response.total_hits}\n"
        report_text += f"- **Time Range:** {self._get_time_range_summary(events)}\n"
        report_text += f"- **Query Execution Time:** {siem_response.execution_time:.2f}s\n\n"
        
        # Event type breakdown
        if aggregations.get('event_types'):
            report_text += f"## Event Type Distribution\n\n"
            for bucket in aggregations['event_types'].get('buckets', []):
                report_text += f"- **{bucket['key']}:** {bucket['doc_count']} events\n"
            report_text += "\n"
        
        # Top source IPs
        if aggregations.get('top_source_ips'):
            report_text += f"## Top Source IPs\n\n"
            for bucket in aggregations['top_source_ips'].get('buckets', []):
                report_text += f"- **{bucket['key']}:** {bucket['doc_count']} events\n"
            report_text += "\n"
        
        # Severity analysis
        severity_data = self._analyze_severity_distribution(events)
        if severity_data:
            report_text += f"## Severity Analysis\n\n"
            for severity, count in severity_data.items():
                report_text += f"- **{severity.upper()}:** {count} events\n"
        
        # Create visualizations
        visualizations = []
        
        if aggregations.get('events_over_time'):
            viz = self._create_time_series_chart(aggregations['events_over_time'])
            visualizations.append(viz)
        
        if severity_data:
            viz = self._create_severity_chart(severity_data)
            visualizations.append(viz)
        
        return {
            "response": report_text,
            "data": {
                "events": [self._event_to_dict(event) for event in events],
                "aggregations": aggregations,
                "summary": self._create_comprehensive_summary(events, aggregations)
            },
            "visualization": visualizations[0] if visualizations else None,
            "additional_charts": visualizations[1:] if len(visualizations) > 1 else []
        }
    
    def _format_statistics_response(self, siem_response: SIEMResponse, query: str) -> Dict[str, Any]:
        """Format statistics query results"""
        
        aggregations = siem_response.aggregations or {}
        events = siem_response.events
        
        response_text = f"Here are the statistics for your query:\n\n"
        
        # Basic counts
        response_text += f"**Total Events:** {siem_response.total_hits}\n"
        
        # Event type statistics
        if aggregations.get('event_types'):
            response_text += f"\n**Event Types:**\n"
            for bucket in aggregations['event_types'].get('buckets', []):
                percentage = (bucket['doc_count'] / siem_response.total_hits * 100) if siem_response.total_hits > 0 else 0
                response_text += f"- {bucket['key']}: {bucket['doc_count']} ({percentage:.1f}%)\n"
        
        # Source IP statistics
        if aggregations.get('top_source_ips'):
            response_text += f"\n**Top Source IPs:**\n"
            for bucket in aggregations['top_source_ips'].get('buckets', [])[:5]:
                response_text += f"- {bucket['key']}: {bucket['doc_count']} events\n"
        
        # Severity distribution
        severity_stats = self._analyze_severity_distribution(events)
        if severity_stats:
            response_text += f"\n**Severity Distribution:**\n"
            for severity, count in severity_stats.items():
                percentage = (count / len(events) * 100) if events else 0
                response_text += f"- {severity.capitalize()}: {count} ({percentage:.1f}%)\n"
        
        # Create pie chart for event types
        visualization = None
        if aggregations.get('event_types'):
            visualization = self._create_pie_chart(
                aggregations['event_types'], 
                "Event Type Distribution"
            )
        
        return {
            "response": response_text,
            "data": {
                "total_hits": siem_response.total_hits,
                "aggregations": aggregations,
                "statistics": {
                    "event_types": aggregations.get('event_types', {}),
                    "severity_distribution": severity_stats,
                    "top_source_ips": aggregations.get('top_source_ips', {})
                }
            },
            "visualization": visualization
        }
    
    def _format_generic_response(self, siem_response: SIEMResponse, query: str) -> Dict[str, Any]:
        """Format generic response"""
        
        total_hits = siem_response.total_hits
        events = siem_response.events[:10]
        
        if total_hits == 0:
            response_text = "No results found for your query. Try rephrasing or expanding your search criteria."
        else:
            response_text = f"Found {total_hits} results for your query."
            if events:
                response_text += "\n\nRecent events:\n"
                for event in events[:3]:
                    response_text += f"- {event.timestamp.strftime('%H:%M:%S')}: {event.description[:100]}...\n"
        
        return {
            "response": response_text,
            "data": {
                "total_hits": total_hits,
                "events": [self._event_to_dict(event) for event in events]
            },
            "visualization": None
        }
    
    def _event_to_dict(self, event: SecurityEvent) -> Dict[str, Any]:
        """Convert SecurityEvent to dictionary"""
        return {
            "id": event.id,
            "timestamp": event.timestamp.isoformat(),
            "source_ip": event.source_ip,
            "destination_ip": event.destination_ip,
            "user": event.user,
            "event_type": event.event_type,
            "severity": event.severity.value,
            "description": event.description,
            "rule_id": event.rule_id,
            "metadata": event.metadata
        }
    
    def _create_events_summary(self, events: List[SecurityEvent]) -> Dict[str, Any]:
        """Create summary statistics for events"""
        if not events:
            return {}
        
        # Count by event type
        event_types = {}
        severity_counts = {}
        source_ips = {}
        
        for event in events:
            event_types[event.event_type] = event_types.get(event.event_type, 0) + 1
            severity_counts[event.severity.value] = severity_counts.get(event.severity.value, 0) + 1
            if event.source_ip:
                source_ips[event.source_ip] = source_ips.get(event.source_ip, 0) + 1
        
        return {
            "event_types": event_types,
            "severity_counts": severity_counts,
            "top_source_ips": dict(sorted(source_ips.items(), key=lambda x: x[1], reverse=True)[:10]),
            "time_range": {
                "start": min(event.timestamp for event in events).isoformat(),
                "end": max(event.timestamp for event in events).isoformat()
            }
        }
    
    def _create_comprehensive_summary(self, events: List[SecurityEvent], aggregations: Dict[str, Any]) -> Dict[str, Any]:
        """Create comprehensive summary for reports"""
        summary = self._create_events_summary(events)
        
        # Add aggregation data
        if aggregations:
            summary["aggregations"] = aggregations
        
        # Calculate additional metrics
        if events:
            summary["metrics"] = {
                "events_per_hour": len(events) / max(1, self._calculate_time_span_hours(events)),
                "unique_source_ips": len(set(e.source_ip for e in events if e.source_ip)),
                "unique_users": len(set(e.user for e in events if e.user)),
                "high_severity_percentage": len([e for e in events if e.severity.value in ['high', 'critical']]) / len(events) * 100
            }
        
        return summary
    
    def _analyze_severity_distribution(self, events: List[SecurityEvent]) -> Dict[str, int]:
        """Analyze severity distribution of events"""
        severity_counts = {}
        for event in events:
            severity = event.severity.value
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
        return severity_counts
    
    def _get_time_range_summary(self, events: List[SecurityEvent]) -> str:
        """Get human-readable time range summary"""
        if not events:
            return "No events"
        
        start_time = min(event.timestamp for event in events)
        end_time = max(event.timestamp for event in events)
        
        return f"{start_time.strftime('%Y-%m-%d %H:%M')} to {end_time.strftime('%Y-%m-%d %H:%M')}"
    
    def _calculate_time_span_hours(self, events: List[SecurityEvent]) -> float:
        """Calculate time span in hours"""
        if len(events) < 2:
            return 1.0
        
        start_time = min(event.timestamp for event in events)
        end_time = max(event.timestamp for event in events)
        
        return max(1.0, (end_time - start_time).total_seconds() / 3600)
    
    def _create_timeline_chart(self, events: List[SecurityEvent]) -> Optional[Dict[str, Any]]:
        """Create timeline visualization"""
        if not events:
            return None
        
        try:
            # Prepare data for timeline
            df_data = []
            for event in events:
                df_data.append({
                    'timestamp': event.timestamp,
                    'severity': event.severity.value,
                    'event_type': event.event_type,
                    'description': event.description[:50] + '...' if len(event.description) > 50 else event.description
                })
            
            df = pd.DataFrame(df_data)
            
            # Create scatter plot
            fig = px.scatter(
                df, 
                x='timestamp', 
                y='event_type',
                color='severity',
                hover_data=['description'],
                title='Security Events Timeline',
                color_discrete_map={
                    'low': '#28a745',
                    'medium': '#ffc107', 
                    'high': '#fd7e14',
                    'critical': '#dc3545'
                }
            )
            
            fig.update_layout(
                xaxis_title="Time",
                yaxis_title="Event Type",
                showlegend=True,
                height=400
            )
            
            return json.loads(fig.to_json())
            
        except Exception as e:
            logger.error(f"Error creating timeline chart: {e}")
            return None
    
    def _create_time_series_chart(self, time_aggregation: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create time series chart from aggregation data"""
        try:
            buckets = time_aggregation.get('buckets', [])
            if not buckets:
                return None
            
            timestamps = []
            counts = []
            
            for bucket in buckets:
                timestamps.append(pd.to_datetime(bucket['key_as_string']))
                counts.append(bucket['doc_count'])
            
            fig = go.Figure()
            fig.add_trace(go.Scatter(
                x=timestamps,
                y=counts,
                mode='lines+markers',
                name='Events',
                line=dict(color='#007bff', width=2),
                marker=dict(size=6)
            ))
            
            fig.update_layout(
                title='Events Over Time',
                xaxis_title='Time',
                yaxis_title='Number of Events',
                showlegend=False,
                height=400
            )
            
            return json.loads(fig.to_json())
            
        except Exception as e:
            logger.error(f"Error creating time series chart: {e}")
            return None
    
    def _create_severity_chart(self, severity_data: Dict[str, int]) -> Optional[Dict[str, Any]]:
        """Create severity distribution chart"""
        try:
            if not severity_data:
                return None
            
            severities = list(severity_data.keys())
            counts = list(severity_data.values())
            
            colors = {
                'low': '#28a745',
                'medium': '#ffc107',
                'high': '#fd7e14', 
                'critical': '#dc3545'
            }
            
            fig = go.Figure(data=[
                go.Bar(
                    x=severities,
                    y=counts,
                    marker_color=[colors.get(s, '#6c757d') for s in severities]
                )
            ])
            
            fig.update_layout(
                title='Events by Severity Level',
                xaxis_title='Severity',
                yaxis_title='Number of Events',
                showlegend=False,
                height=400
            )
            
            return json.loads(fig.to_json())
            
        except Exception as e:
            logger.error(f"Error creating severity chart: {e}")
            return None
    
    def _create_pie_chart(self, aggregation_data: Dict[str, Any], title: str) -> Optional[Dict[str, Any]]:
        """Create pie chart from aggregation data"""
        try:
            buckets = aggregation_data.get('buckets', [])
            if not buckets:
                return None
            
            labels = [bucket['key'] for bucket in buckets]
            values = [bucket['doc_count'] for bucket in buckets]
            
            fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=.3)])
            fig.update_layout(
                title=title,
                showlegend=True,
                height=400
            )
            
            return json.loads(fig.to_json())
            
        except Exception as e:
            logger.error(f"Error creating pie chart: {e}")
            return None

# backend/app/utils/query_templates.py
"""Query templates for common SIEM operations"""

ELASTICSEARCH_TEMPLATES = {
    "failed_logins": {
        "query": {
            "bool": {
                "must": [
                    {"match": {"event.category": "authentication"}},
                    {"match": {"event.outcome": "failure"}}
                ],
                "filter": [
                    {"range": {"@timestamp": {"gte": "now-24h"}}}
                ]
            }
        },
        "sort": [{"@timestamp": {"order": "desc"}}]
    },
    
    "malware_detections": {
        "query": {
            "bool": {
                "should": [
                    {"match": {"event.category": "malware"}},
                    {"match": {"rule.name": "*malware*"}},
                    {"match": {"rule.name": "*virus*"}},
                    {"range": {"event.risk_score": {"gte": 70}}}
                ],
                "minimum_should_match": 1,
                "filter": [
                    {"range": {"@timestamp": {"gte": "now-7d"}}}
                ]
            }
        }
    },
    
    "network_anomalies": {
        "query": {
            "bool": {
                "must": [
                    {"match": {"event.category": "network"}}
                ],
                "should": [
                    {"range": {"network.bytes": {"gte": 10000000}}},
                    {"match": {"event.action": "blocked"}},
                    {"range": {"event.risk_score": {"gte": 50}}}
                ],
                "filter": [
                    {"range": {"@timestamp": {"gte": "now-1h"}}}
                ]
            }
        }
    },
    
    "suspicious_processes": {
        "query": {
            "bool": {
                "must": [
                    {"match": {"event.category": "process"}}
                ],
                "should": [
                    {"wildcard": {"process.name": "*powershell*"}},
                    {"wildcard": {"process.name": "*cmd*"}},
                    {"wildcard": {"process.args": "*-encoded*"}},
                    {"wildcard": {"process.args": "*invoke*"}}
                ],
                "minimum_should_match": 1
            }
        }
    }
}

KQL_TEMPLATES = {
    "failed_logins": 'event.category:"authentication" AND event.outcome:"failure"',
    "malware_detections": 'event.category:"malware" OR rule.name:*malware* OR rule.name:*virus*',
    "network_anomalies": 'event.category:"network" AND (network.bytes:>=10000000 OR event.action:"blocked")',
    "suspicious_processes": 'event.category:"process" AND (process.name:*powershell* OR process.name:*cmd*)'
}

# Common aggregations
COMMON_AGGREGATIONS = {
    "events_by_hour": {
        "date_histogram": {
            "field": "@timestamp",
            "calendar_interval": "1h"
        }
    },
    
    "top_source_ips": {
        "terms": {
            "field": "source.ip.keyword",
            "size": 10
        }
    },
    
    "event_categories": {
        "terms": {
            "field": "event.category.keyword",
            "size": 20
        }
    },
    
    "severity_levels": {
        "terms": {
            "field": "event.severity.keyword",
            "size": 5
        }
    },
    
    "top_users": {
        "terms": {
            "field": "user.name.keyword",
            "size": 10
        }
    },
    
    "hosts_with_most_events": {
        "terms": {
            "field": "host.name.keyword", 
            "size": 10
        }
    }
}