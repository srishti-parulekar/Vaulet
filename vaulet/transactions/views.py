from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import (

    TransactionSerializer
)
from .models import Transaction
from django_filters.rest_framework import DjangoFilterBackend

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['transaction_type', 'challenge', 'vault']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

