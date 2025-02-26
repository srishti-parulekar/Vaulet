from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class ChatbotConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chatbot'
    team_agent = None
    
    def ready(self):
        """
        Initialize the team agent when Django starts.
        This is only called once during server startup.
        """
        # Import in method to avoid circular imports
        try:
            from . import agents
            # Store the agent in the app config for reuse
            self.team_agent = agents.get_team_agent()
            logger.info("Team agent initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize team agent: {str(e)}")