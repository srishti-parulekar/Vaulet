from django.shortcuts import render
from transactions.models import Transaction
from .serializers import ChallengeSerializer
from .models import Challenge
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from api.models import PersonalVault
from decimal import Decimal
from django.utils.timezone import now
from django.db import transaction


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
            
            # Check if contribution would exceed target amount
            if challenge.current_amount + amount > challenge.target_amount:
                return Response({
                    "error": f"Contribution would exceed target amount. Maximum allowed: {challenge.target_amount - challenge.current_amount}"
                }, status=400)
                
            challenge.contribute(amount)
            Transaction.objects.create(
                user = request.user,
                transaction_type = "CHALLENGE_CONTRIBUTION",
                amount = amount,
                description=f"Contributed to challenge '{challenge.title}'",
                challenge = challenge
            )

            return Response({
                "message": "Contribution successful",
                "current_amount": challenge.current_amount,
                "target_amount": challenge.target_amount,
                "is_completed": challenge.current_amount >= challenge.target_amount
            })
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except PersonalVault.DoesNotExist:
            return Response({"error": "Personal vault not found"}, status=400)

class ChallengeRedeemView(generics.UpdateAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Challenge, id=self.kwargs['pk'])
    
    # ensures that all the operations within the decorated method 
    # execute within a single database transaction.

    #If any operation within the method fails or an exception is raised, 
    # all changes made during that transaction are rolled back, leaving the 
    # database in its previous state.
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        challenge = self.get_object()
        
        # Verify challenge is completed and not already redeemed
        if not challenge.current_amount >= challenge.target_amount:
            return Response({"error": "Challenge not completed yet"}, status=400)
            
        if getattr(challenge, 'is_redeemed', False):
            return Response({"error": "Challenge already redeemed"}, status=400)

        try:
            # Get user's personal vault
            vault = PersonalVault.objects.get(user=request.user)
            
            # Transfer amount back to vault
            vault.balance += challenge.current_amount
            vault.save()
            
            # Mark challenge as redeemed
            challenge.is_redeemed = True
            challenge.save()
            Transaction.objects.create(
                user = request.user,
                amount = challenge.target_amount,
                transaction_type = "CHALLENGE_REFUND",
                description =f"Redeemed from challenge '{challenge.title}'",
                challenge = challenge
            )
            return Response({
                "message": "Challenge amount redeemed successfully",
                "redeemed_amount": challenge.current_amount,
                "new_vault_balance": vault.balance
            })
            
        except PersonalVault.DoesNotExist:
            return Response({"error": "Personal vault not found"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400) 