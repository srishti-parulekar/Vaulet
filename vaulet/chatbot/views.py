from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .agents import get_team_agent

@csrf_exempt
def chat_endpoint(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message', '')
            user_id = data.get('userId')
            
            # Include user ID in the message if provided
            if user_id:
                full_message = f"i am user {user_id}. {message}"
            else:
                full_message = message
                
            # Get response from agent
            agent = get_team_agent()
            response = agent.run(full_message)
            
            return JsonResponse({'response': response})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)