import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from email_validator import validate_email as email_validate, EmailNotValidError

def validate_query_input(query: str) -> Dict[str, Any]:
    """Validate user query input"""
    validation_result = {
        "valid": True,
        "errors": [],
        "warnings": []
    }
    
    if len(query.strip()) == 0:
        validation_result["valid"] = False
        validation_result["errors"].append("Query cannot be empty")
        return validation_result
    
    if len(query) > 1000:
        validation_result["warnings"].append("Query is very long, consider shortening it")
    
    # Check for potential injection attempts
    suspicious_patterns = [
        r'<script[^>]*>',
        r'javascript:',
        r'onload\s*=',
        r'eval\s*\(',
        r'document\.',
        r'window\.'
    ]
    
    for pattern in suspicious_patterns:
        if re.search(pattern, query, re.IGNORECASE):
            validation_result["valid"] = False
            validation_result["errors"].append("Query contains potentially unsafe content")
            break
    
    return validation_result

def validate_time_range(start_time: str, end_time: str) -> Dict[str, Any]:
    """Validate time range parameters"""
    validation_result = {
        "valid": True,
        "errors": []
    }
    
    try:
        start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
        
        if end_dt <= start_dt:
            validation_result["valid"] = False
            validation_result["errors"].append("End time must be after start time")
        
        if (end_dt - start_dt).days > 365:
            validation_result["valid"] = False
            validation_result["errors"].append("Time range cannot exceed 1 year")
        
        if start_dt > datetime.now():
            validation_result["valid"] = False
            validation_result["errors"].append("Start time cannot be in the future")
            
    except ValueError as e:
        validation_result["valid"] = False
        validation_result["errors"].append(f"Invalid date format: {str(e)}")
    
    return validation_result

def validate_email(email: str) -> Dict[str, Any]:
    """Validate email address"""
    validation_result = {
        "valid": True,
        "errors": []
    }
    
    try:
        valid = email_validate(email)
        email = valid.email
    except EmailNotValidError as e:
        validation_result["valid"] = False
        validation_result["errors"].append(str(e))
    
    return validation_result

def validate_password_strength(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    validation_result = {
        "valid": True,
        "errors": [],
        "strength": 0
    }
    
    if len(password) < 8:
        validation_result["valid"] = False
        validation_result["errors"].append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        validation_result["errors"].append("Password must contain at least one uppercase letter")
        validation_result["valid"] = False
    
    if not re.search(r'[a-z]', password):
        validation_result["errors"].append("Password must contain at least one lowercase letter")
        validation_result["valid"] = False
    
    if not re.search(r'\d', password):
        validation_result["errors"].append("Password must contain at least one number")
        validation_result["valid"] = False
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        validation_result["errors"].append("Password must contain at least one special character")
        validation_result["valid"] = False
    
    # Calculate strength
    strength = 0
    if len(password) >= 8: strength += 1
    if re.search(r'[A-Z]', password): strength += 1
    if re.search(r'[a-z]', password): strength += 1
    if re.search(r'\d', password): strength += 1
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password): strength += 1
    
    validation_result["strength"] = strength
    
    return validation_result

def validate_ip_address(ip: str) -> bool:
    """Validate IP address format"""
    ipv4_pattern = r'^(\d{1,3}\.){3}\d{1,3}