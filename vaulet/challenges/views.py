from django.shortcuts import render
from .serializers import ChallengeSerializer
from .models import Challenge
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from api.models import PersonalVault
from decimal import Decimal
from django.utils.timezone import now


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
  