import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import asyncio
from models.siem_models import SecurityEvent

logger = logging.getLogger(__name__)

class AIThreatDetectionService:
    """AI-powered threat detection and anomaly analysis"""
    
    def __init__(self):
        self.isolation_forest = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.threat_patterns = {}
        
    async def initialize(self):
        """Initialize AI models"""
        try:
            logger.info("Initializing AI threat detection service...")
            await self._load_threat_patterns()
            logger.info("AI threat detection service initialized")
        except Exception as e:
            logger.error(f"Failed to initialize AI service: {e}")
    
    async def _load_threat_patterns(self):
        """Load known threat patterns"""
        self.threat_patterns = {
            'brute_force': {
                'min_attempts': 5,
                'time_window': 300,  # 5 minutes
                'indicators': ['failed_login', 'authentication_failure']
            },
            'data_exfiltration': {
                'min_data_size': 100000,  # 100KB
                'unusual_hours': [22, 23, 0, 1, 2, 3, 4, 5, 6],
                'indicators': ['file_access', 'network_transfer']
            },
            'privilege_escalation': {
                'admin_actions': ['user_add', 'permission_change', 'policy_modify'],
                'suspicious_processes': ['powershell', 'cmd', 'wmic']
            }
        }
    
    async def analyze_events(self, events: List[SecurityEvent]) -> Dict[str, Any]:
        """Analyze security events using AI"""
        if not events:
            return {"anomalies": [], "threats": [], "risk_score": 0}
        
        try:
            # Extract features from events
            features = self._extract_features(events)
            
            # Detect anomalies
            anomalies = await self._detect_anomalies(features, events)
            
            # Detect known threat patterns
            threats = await self._detect_threat_patterns(events)
            
            # Calculate overall risk score
            risk_score = self._calculate_risk_score(anomalies, threats)
            
            return {
                "anomalies": anomalies,
                "threats": threats,
                "risk_score": risk_score,
                "recommendations": self._generate_recommendations(threats, risk_score)
            }
            
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            return {"anomalies": [], "threats": [], "risk_score": 0, "error": str(e)}
    
    def _extract_features(self, events: List[SecurityEvent]) -> np.ndarray:
        """Extract numerical features from security events"""
        features = []
        
        for event in events:
            feature_vector = [
                event.timestamp.hour,  # Hour of day
                len(event.description),  # Description length
                hash(event.event_type) % 1000,  # Event type hash
                1 if event.source_ip else 0,  # Has source IP
                {'low': 1, 'medium': 2, 'high': 3, 'critical': 4}.get(event.severity.value, 0),
                len(event.metadata),  # Metadata richness
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    async def _detect_anomalies(self, features: np.ndarray, events: List[SecurityEvent]) -> List[Dict[str, Any]]:
        """Use Isolation Forest to detect anomalous events"""
        if len(features) < 10:  # Need minimum samples
            return []
        
        try:
            # Scale features
            features_scaled = self.scaler.fit_transform(features)
            
            # Train or use existing model
            if not self.is_trained:
                self.isolation_forest.fit(features_scaled)
                self.is_trained = True
            
            # Predict anomalies (-1 for anomaly, 1 for normal)
            predictions = self.isolation_forest.predict(features_scaled)
            anomaly_scores = self.isolation_forest.decision_function(features_scaled)
            
            anomalies = []
            for i, (prediction, score) in enumerate(zip(predictions, anomaly_scores)):
                if prediction == -1:  # Anomaly detected
                    anomalies.append({
                        "event_id": events[i].id,
                        "event_type": events[i].event_type,
                        "timestamp": events[i].timestamp.isoformat(),
                        "anomaly_score": float(score),
                        "description": events[i].description[:100],
                        "severity": events[i].severity.value,
                        "confidence": min(abs(score) * 10, 1.0)  # Normalize to 0-1
                    })
            
            return sorted(anomalies, key=lambda x: x['anomaly_score'])
            
        except Exception as e:
            logger.error(f"Anomaly detection failed: {e}")
            return []
    
    async def _detect_threat_patterns(self, events: List[SecurityEvent]) -> List[Dict[str, Any]]:
        """Detect known threat patterns"""
        threats = []
        
        # Group events by source IP and time
        ip_events = {}
        for event in events:
            if event.source_ip:
                if event.source_ip not in ip_events:
                    ip_events[event.source_ip] = []
                ip_events[event.source_ip].append(event)
        
        # Detect brute force attacks
        for ip, ip_event_list in ip_events.items():
            brute_force = await self._detect_brute_force(ip_event_list, ip)
            if brute_force:
                threats.append(brute_force)
        
        # Detect data exfiltration
        exfiltration = await self._detect_data_exfiltration(events)
        if exfiltration:
            threats.extend(exfiltration)
        
        # Detect privilege escalation
        privilege_esc = await self._detect_privilege_escalation(events)
        if privilege_esc:
            threats.extend(privilege_esc)
        
        return threats
    
    async def _detect_brute_force(self, events: List[SecurityEvent], ip: str) -> Optional[Dict[str, Any]]:
        """Detect brute force attacks"""
        pattern = self.threat_patterns['brute_force']
        
        # Filter failed login attempts
        failed_logins = [
            e for e in events 
            if any(indicator in e.description.lower() for indicator in pattern['indicators'])
        ]
        
        if len(failed_logins) >= pattern['min_attempts']:
            # Check time window
            time_sorted = sorted(failed_logins, key=lambda x: x.timestamp)
            time_diff = (time_sorted[-1].timestamp - time_sorted[0].timestamp).total_seconds()
            
            if time_diff <= pattern['time_window']:
                return {
                    "threat_type": "brute_force",
                    "source_ip": ip,
                    "attempts": len(failed_logins),
                    "time_window": time_diff,
                    "severity": "high",
                    "confidence": min(len(failed_logins) / 10.0, 1.0),
                    "description": f"Detected {len(failed_logins)} failed login attempts from {ip} in {time_diff:.0f} seconds"
                }
        
        return None
    
    async def _detect_data_exfiltration(self, events: List[SecurityEvent]) -> List[Dict[str, Any]]:
        """Detect potential data exfiltration"""
        threats = []
        pattern = self.threat_patterns['data_exfiltration']
        
        # Look for large data transfers during unusual hours
        for event in events:
            if event.timestamp.hour in pattern['unusual_hours']:
                if any(indicator in event.description.lower() for indicator in pattern['indicators']):
                    # Mock data size analysis (in real scenario, parse from event metadata)
                    estimated_size = len(event.description) * 100  # Mock calculation
                    
                    if estimated_size > pattern['min_data_size']:
                        threats.append({
                            "threat_type": "data_exfiltration",
                            "event_id": event.id,
                            "timestamp": event.timestamp.isoformat(),
                            "estimated_data_size": estimated_size,
                            "severity": "critical",
                            "confidence": 0.7,
                            "description": f"Suspicious data transfer during unusual hours: {event.description[:100]}"
                        })
        
        return threats
    
    async def _detect_privilege_escalation(self, events: List[SecurityEvent]) -> List[Dict[str, Any]]:
        """Detect privilege escalation attempts"""
        threats = []
        pattern = self.threat_patterns['privilege_escalation']
        
        for event in events:
            # Check for admin actions
            if any(action in event.description.lower() for action in pattern['admin_actions']):
                threats.append({
                    "threat_type": "privilege_escalation",
                    "event_id": event.id,
                    "timestamp": event.timestamp.isoformat(),
                    "action": event.description[:100],
                    "severity": "high",
                    "confidence": 0.6,
                    "description": f"Potential privilege escalation: {event.description[:100]}"
                })
            
            # Check for suspicious processes
            if any(process in event.description.lower() for process in pattern['suspicious_processes']):
                threats.append({
                    "threat_type": "suspicious_process",
                    "event_id": event.id,
                    "timestamp": event.timestamp.isoformat(),
                    "process": event.description[:100],
                    "severity": "medium",
                    "confidence": 0.5,
                    "description": f"Suspicious process execution: {event.description[:100]}"
                })
        
        return threats
    
    def _calculate_risk_score(self, anomalies: List[Dict], threats: List[Dict]) -> float:
        """Calculate overall risk score (0-100)"""
        risk_score = 0
        
        # Add risk from anomalies
        for anomaly in anomalies:
            risk_score += anomaly.get('confidence', 0) * 20
        
        # Add risk from threats
        severity_weights = {'low': 10, 'medium': 25, 'high': 50, 'critical': 80}
        for threat in threats:
            severity = threat.get('severity', 'medium')
            confidence = threat.get('confidence', 0.5)
            risk_score += severity_weights.get(severity, 25) * confidence
        
        return min(risk_score, 100)  # Cap at 100
    
    def _generate_recommendations(self, threats: List[Dict], risk_score: float) -> List[str]:
        """Generate security recommendations based on detected threats"""
        recommendations = []
        
        if risk_score > 70:
            recommendations.append("🚨 High risk detected - Consider immediate security review")
        
        # Threat-specific recommendations
        threat_types = [threat['threat_type'] for threat in threats]
        
        if 'brute_force' in threat_types:
            recommendations.append("🔒 Implement account lockout policies and IP blocking")
        
        if 'data_exfiltration' in threat_types:
            recommendations.append("📊 Review data access patterns and implement DLP controls")
        
        if 'privilege_escalation' in threat_types:
            recommendations.append("👤 Audit user permissions and implement least privilege access")
        
        if not recommendations:
            recommendations.append("✅ No immediate security concerns detected")
        
        return recommendations