from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import (
    PersonalVaultSerializer,
    UserSerializer,
    MoneyVaultSerializer,
    ChallengeSerializer,
    UserPerformanceSerializer,
    ExpenseSerializer,
    TransactionSerializer
)
from .models import MoneyVault, Challenge, PersonalVault, UserPerformance, Expense, Transaction
from rest_framework.response import Response
from django.utils.timezone import now
from django.shortcuts import get_object_or_404
from decimal import Decimal
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime, timedelta
from django.db.models import Sum


class MoneyVaultListCreate(generics.ListCreateAPIView):
    serializer_class = MoneyVaultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # to get the user that is actually interacting with this view
        user = self.request.user
        # MoneyVault.objects.all to return all notes
        # filter to filter through and return only the ones written by the user
        return MoneyVault.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class MoneyVaultDelete(generics.DestroyAPIView):
    serializer_class = MoneyVaultSerializer
    permission_classes = [IsAuthenticated]

    # can only delete vaults the user owns
    def get_queryset(self):
        user = self.request.user
        return MoneyVault.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    # specifies the list of objects we need to check to not create preexisting user
    queryset = User.objects.all
    # tells the data what kind of data we need to accept
    serializer_class = UserSerializer
    # who can access
    permission_classes = [AllowAny]


class JoinChallengeView(generics.UpdateAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Challenge.objects.all()

    def update(self, request, *args, **kwargs):
        challenge = self.get_object()

        # Check if the user is already a participant to prevent duplicates
        if request.user in challenge.participants.all():
            return Response(
                {"message": "You are already a participant in this challenge!"},
                status=400,
            )

        # Add the current user as a participant
        challenge.participants.add(request.user)
        challenge.save()

        return Response({"message": "You have joined the challenge successfully!"})


class ChallengeListCreateView(generics.ListCreateAPIView):

    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # List only active challenges for the user
        user = self.request.user
        return Challenge.objects.filter(user=user, end_date__gt=now())

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChallengeCompleteView(generics.UpdateAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        challenge = self.get_object()

        if challenge.is_completed():
            return Response({"message": "Challenge completed successfully!"})
        else:
            return Response({"message": "Challenge is not completed yet!"})


class ChallengeListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all challenges for the logged-in user
        user = request.user
        challenges = Challenge.objects.filter(user=user)

        # Separate challenges into categories
        active_challenges = []
        completed_challenges = []
        expired_challenges = []

        for challenge in challenges:
            if challenge.is_completed():
                completed_challenges.append(challenge)
            elif not challenge.is_active():
                # Delete expired challenges automatically
                challenge.delete()
                expired_challenges.append(challenge)
            else:
                active_challenges.append(challenge)

        # Serialize the data
        active_data = ChallengeSerializer(active_challenges, many=True).data
        completed_data = ChallengeSerializer(completed_challenges, many=True).data
        expired_data = ChallengeSerializer(expired_challenges, many=True).data

        # Return a structured response
        return Response(
            {
                "active_challenges": active_data,
                "completed_challenges": completed_data,
                "expired_challenges": expired_data,
            }
        )

class ChallengeContributeView(generics.UpdateAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Challenge, id=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        challenge = self.get_object()
        amount = request.data.get('amount')

        if not amount:
            return Response({"error": "Amount is required"}, status=400)

        try:
            amount = Decimal(amount)
            challenge.contribute(amount)
            return Response({
                "message": "Contribution successful",
                "current_amount": challenge.current_amount,
                "target_amount": challenge.target_amount
            })
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except PersonalVault.DoesNotExist:
            return Response({"error": "Personal vault not found"}, status=400)
        

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
    
class MoneyVaultContributeView(generics.UpdateAPIView):
    serializer_class = MoneyVaultSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(MoneyVault, id=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        vault = self.get_object()
        amount = request.data.get('amount')

        if not amount:
            return Response({"error": "Amount is required"}, status=400)

        try:
            amount = Decimal(amount)
            personal_vault = request.user.personal_vault

            if personal_vault.balance < amount:
                return Response({"error": "Insufficient funds"}, status=400)

            personal_vault.balance -= amount
            vault.balance += amount
            
            personal_vault.save()
            vault.save()

            return Response({
                "message": "Contribution successful",
                "vault_balance": vault.balance,
                "personal_vault_balance": personal_vault.balance
            })
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except PersonalVault.DoesNotExist:
            return Response({"error": "Personal vault not found"}, status=400)


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