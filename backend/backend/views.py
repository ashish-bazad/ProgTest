from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@login_required
def get_user_data(request):
    user = request.user
    user_data = {
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }
    return JsonResponse(user_data)

def check_authentication(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    else:
        return JsonResponse({'authenticated': False})