from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import CreateUserView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/challenges/", include("challenges.urls")),  
    path("api/expenses/", include("expenses.urls")),  
    path("api/transactions/", include("transactions.urls")),  
    path("api/vault/", include("vaults.urls")),  
    path('api/chatbot/', include('chatbot.urls')),
    path("api/", include("api.urls")),
]
