from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SIEM NLP Assistant"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Elasticsearch Configuration
    ELASTICSEARCH_HOST: str = os.getenv("ELASTICSEARCH_HOST", "localhost:9200")
    ELASTICSEARCH_USERNAME: str = os.getenv("ELASTICSEARCH_USERNAME", "elastic")
    ELASTICSEARCH_PASSWORD: str = os.getenv("ELASTICSEARCH_PASSWORD", "")
    ELASTICSEARCH_USE_SSL: bool = os.getenv("ELASTICSEARCH_USE_SSL", "false").lower() == "true"
    ELASTICSEARCH_VERIFY_CERTS: bool = os.getenv("ELASTICSEARCH_VERIFY_CERTS", "false").lower() == "true"
    
    # Wazuh Configuration 
    
    # (Wazuh ek open-source security monitoring tool hai jo primarily system monitoring, intrusion detection, and compliance management ke liye use hota hai.)
    
    # WAZUH_API_URL: str = os.getenv("WAZUH_API_URL", "https://localhost:55000")
    # WAZUH_USERNAME: str = os.getenv("WAZUH_USERNAME", "wazuh")
    # WAZUH_PASSWORD: str = os.getenv("WAZUH_PASSWORD", "")
    
    # NLP Configuration
    NLP_MODEL_NAME: str = "distilbert-base-cased"
    SPACY_MODEL: str = "en_core_web_sm"
    
    # # Redis Configuration (for context management)
    # REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    # REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    # REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "f2a3d7c1b9e947a1d219b8d3226f91a4f6b984ba5396b69e73d6f0c71eaf7e43")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        case_sensitive = True

settings = Settings()