import spacy
import logging
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
from typing import List, Dict, Any, Tuple, Optional
import re
from datetime import datetime, timedelta
from models.chat_models import QueryIntent
from models.siem_models import ExtractedEntity, EntityType
from core.config import settings

logger = logging.getLogger(__name__)

class NLPService:
    def __init__(self):
        self.nlp = None
        self.intent_classifier = None
        self.tokenizer = None
        self.model = None
        self.intent_patterns = {
            QueryIntent.SEARCH_LOGS: [
                r"show.*logs?", r"find.*events?", r"search.*for", r"what.*happened",
                r"suspicious.*activity", r"failed.*login", r"malware.*detection"
            ],
            QueryIntent.GENERATE_REPORT: [
                r"generate.*report", r"create.*summary", r"show.*report",
                r"summarize.*", r"give.*me.*overview"
            ],
            QueryIntent.GET_STATISTICS: [
                r"how.*many", r"count.*", r"statistics.*", r"stats.*",
                r"total.*number", r"frequency.*"
            ],
            QueryIntent.FILTER_RESULTS: [
                r"filter.*", r"only.*show", r"exclude.*", r"remove.*",
                r"just.*the.*ones", r"limit.*to"
            ]
        }
        
    async def initialize(self):
        """Initialize NLP models and components"""
        try:
            logger.info("Initializing NLP service...")
            
            # Load spaCy model
            try:
                self.nlp = spacy.load(settings.SPACY_MODEL)
            except OSError:
                logger.warning(f"SpaCy model {settings.SPACY_MODEL} not found, downloading...")
                spacy.cli.download(settings.SPACY_MODEL)
                self.nlp = spacy.load(settings.SPACY_MODEL)
            
            # Initialize intent classification
            self.intent_classifier = pipeline(
                "text-classification",
                model=settings.NLP_MODEL_NAME,
                return_all_scores=True
            )
            
            logger.info("NLP service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize NLP service: {e}")
            raise

    async def cleanup(self):
        """Cleanup NLP resources"""
        logger.info("Cleaning up NLP service...")
        # Cleanup if needed

    def extract_intent(self, text: str) -> Tuple[QueryIntent, float]:
        """Extract intent from user query"""
        text_lower = text.lower()
        
        # Pattern-based intent detection
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return intent, 0.8
        
        # Default intent
        return QueryIntent.SEARCH_LOGS, 0.6

    def extract_entities(self, text: str) -> List[ExtractedEntity]:
        """Extract relevant entities from text"""
        entities = []
        doc = self.nlp(text)
        
        # Extract named entities
        for ent in doc.ents:
            entity_type = self._map_spacy_entity_type(ent.label_)
            if entity_type:
                entities.append(ExtractedEntity(
                    type=entity_type,
                    value=ent.text,
                    confidence=0.8,
                    start_pos=ent.start_char,
                    end_pos=ent.end_char
                ))
        
        # Extract custom entities using regex patterns
        custom_entities = self._extract_custom_entities(text)
        entities.extend(custom_entities)
        
        return entities

    def _map_spacy_entity_type(self, spacy_label: str) -> Optional[EntityType]:
        """Map spaCy entity labels to our custom entity types"""
        mapping = {
            "PERSON": EntityType.USERNAME,
            "ORG": EntityType.HOSTNAME,
            "GPE": EntityType.HOSTNAME,
            "DATE": EntityType.TIME_RANGE,
            "TIME": EntityType.TIME_RANGE
        }
        return mapping.get(spacy_label)

    def _extract_custom_entities(self, text: str) -> List[ExtractedEntity]:
        """Extract custom entities using regex patterns"""
        entities = []
        
        # IP address pattern
        ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        for match in re.finditer(ip_pattern, text):
            entities.append(ExtractedEntity(
                type=EntityType.IP_ADDRESS,
                value=match.group(),
                confidence=0.9,
                start_pos=match.start(),
                end_pos=match.end()
            ))
        
        # Port pattern
        port_pattern = r'\bport\s+(\d{1,5})\b'
        for match in re.finditer(port_pattern, text, re.IGNORECASE):
            entities.append(ExtractedEntity(
                type=EntityType.PORT,
                value=match.group(1),
                confidence=0.8,
                start_pos=match.start(1),
                end_pos=match.end(1)
            ))
        
        # File path pattern
        path_pattern = r'[/\\][^\s]*[/\\][^\s]*'
        for match in re.finditer(path_pattern, text):
            entities.append(ExtractedEntity(
                type=EntityType.FILE_PATH,
                value=match.group(),
                confidence=0.7,
                start_pos=match.start(),
                end_pos=match.end()
            ))
        
        # Time range patterns
        time_entities = self._extract_time_entities(text)
        entities.extend(time_entities)
        
        return entities

    def _extract_time_entities(self, text: str) -> List[ExtractedEntity]:
        """Extract time-related entities"""
        entities = []
        
        # Time keywords mapping
        time_patterns = {
            r'\b(yesterday|last\s+24\s+hours?)\b': -1,
            r'\b(last\s+week|past\s+week)\b': -7,
            r'\b(last\s+month|past\s+month)\b': -30,
            r'\b(today|last\s+hour)\b': 0,
        }
        
        for pattern, days_offset in time_patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                entities.append(ExtractedEntity(
                    type=EntityType.TIME_RANGE,
                    value=match.group(),
                    confidence=0.8,
                    start_pos=match.start(),
                    end_pos=match.end()
                ))
        
        return entities

    def process_query(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process a user query and extract structured information"""
        try:
            # Extract intent
            intent, confidence = self.extract_intent(query)
            
            # Extract entities
            entities = self.extract_entities(query)
            
            # Create structured output
            result = {
                "intent": intent,
                "confidence": confidence,
                "entities": [entity.dict() for entity in entities],
                "original_query": query,
                "processed": True
            }
            
            # Add context if available
            if context:
                result["context"] = context
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return {
                "intent": QueryIntent.UNKNOWN,
                "confidence": 0.0,
                "entities": [],
                "original_query": query,
                "processed": False,
                "error": str(e)
            }