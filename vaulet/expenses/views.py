from rest_framework import generics,filters
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import (
    ExpenseSerializer,
)
from .models import Expense
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime, timedelta
from django.db.models import Sum


class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'necessity_level']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseStatsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        today = datetime.now().date()
        month_start = today.replace(day=1)
        last_month_start = (month_start - timedelta(days=1)).replace(day=1)

        # Get monthly stats
        monthly_expenses = Expense.objects.filter(
            user=request.user,
            date__gte=month_start
        )
        
        # Get category breakdown
        category_breakdown = monthly_expenses.values('category').annotate(
            total=Sum('amount')
        )

        # Get necessity level breakdown
        necessity_breakdown = monthly_expenses.values('necessity_level').annotate(
            total=Sum('amount')
        )

        # Compare with last month
        last_month_total = Expense.objects.filter(
            user=request.user,
            date__gte=last_month_start,
            date__lt=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0

        current_month_total = monthly_expenses.aggregate(
            total=Sum('amount'))['total'] or 0

        return Response({
            'current_month_total': current_month_total,
            'last_month_total': last_month_total,
            'month_over_month_change': current_month_total - last_month_total,
            'category_breakdown': category_breakdown,
            'necessity_breakdown': necessity_breakdown
        })