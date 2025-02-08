from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import (
    PersonalVaultSerializer,
    UserSerializer,
    UserPerformanceSerializer,
    ExpenseSerializer,
    TransactionSerializer
)
from .models import PersonalVault, UserPerformance, Expense, Transaction
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime, timedelta
from django.db.models import Sum



class CreateUserView(generics.CreateAPIView):
    # specifies the list of objects we need to check to not create preexisting user
    queryset = User.objects.all
    # tells the data what kind of data we need to accept
    serializer_class = UserSerializer
    # who can access
    permission_classes = [AllowAny]

      

class PersonalVaultCreateView(generics.UpdateAPIView):
    serializer_class = PersonalVaultSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(PersonalVault, user=self.request.user)

    def put(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        personal_vault = self.get_object()
        serializer.update(personal_vault, serializer.validated_data)
        
        return Response(
            {"message": "Card details successfully set!"}, 
            status=status.HTTP_200_OK)


class PersonalVaultDetailView(generics.RetrieveAPIView):
    serializer_class = PersonalVaultSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(PersonalVault, user=self.request.user)


class PersonalVaultUpdateView(generics.UpdateAPIView):
    serializer_class = PersonalVaultSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(PersonalVault, user=self.request.user)
    

class UserPerformanceView(generics.RetrieveAPIView):
    serializer_class = UserPerformanceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserPerformance.objects.get_or_create(user=self.request.user)[0]

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['transaction_type', 'challenge', 'vault']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

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