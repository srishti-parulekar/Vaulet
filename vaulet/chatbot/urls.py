# chatbot/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('chatbot/', views.chat_endpoint, name='chat_endpoint'),
]