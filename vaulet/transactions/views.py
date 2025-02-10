from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import TransactionSerializer
from .models import Transaction
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters

class TransactionFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(method='filter_by_title')
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    start_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    end_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    def filter_by_title(self, queryset, name, value):
        return queryset.filter(
            models.Q(challenge_title__icontains=value) | 
            models.Q(vault_title__icontains=value)
        )

    class Meta:
        model = Transaction
        fields = {
            'transaction_type': ['exact'],
            'challenge': ['exact'],
            'vault': ['exact'],
            'challenge_title': ['exact', 'icontains'],
            'vault_title': ['exact', 'icontains'],
        }

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = TransactionFilter
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    search_fields = ['challenge_title', 'vault_title', 'description']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)