from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .agents import get_agent_response, get_team_agent
from django.apps import apps
from django.core.cache import cache
import time

logger = logging.getLogger(__name__)

@csrf_exempt
def chat_endpoint(request):

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    
    start_time = time.time()
    
    try:
        # Parse request data
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)
        
        message = data.get('message', '')
        if not message.strip():
            return JsonResponse({'error': 'Message cannot be empty'}, status=400)
            
        user_id = data.get('userId')
        
        # Rate limiting based on user_id or IP address
        rate_limit_key = f"chat_rate_limit:{user_id or request.META.get('REMOTE_ADDR')}"
        if cache.get(rate_limit_key, 0) >= 10:  # 10 requests per minute
            return JsonResponse({'error': 'Rate limit exceeded. Please try again later.'}, status=429)
        cache.set(rate_limit_key, cache.get(rate_limit_key, 0) + 1, 60)  # 1 minute expiration
        
        # Prepare message with user ID
        full_message = f"i am user {user_id}. {message}" if user_id else message
            
        # Get the team agent from app config
        app_config = apps.get_app_config('chatbot')
        if not app_config.team_agent:
            # Fallback if agent not initialized in app config
            logger.warning("Team agent not found in app config, initializing now")
            app_config.team_agent = get_team_agent()
        
        # Process message with agent
        response_text = get_agent_response(app_config.team_agent, full_message)
        
        # Log request stats
        processing_time = time.time() - start_time
        logger.info(f"Chat request processed in {processing_time:.2f}s for user {user_id or 'anonymous'}")
        
        return JsonResponse({
            'response': response_text,
            'processing_time': f"{processing_time:.2f}s"
        })
            
    except Exception as e:
        logger.exception(f"Error processing chat request: {str(e)}")
        return JsonResponse({'error': f"An error occurred: {str(e)}"}, status=500)