from rest_framework import generics 
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer, MoneyVaultSerializer, ChallengeSerializer
from .models import MoneyVault, Challenge
from rest_framework.response import Response

class MoneyVaultListCreate(generics.ListCreateAPIView):
    serializer_class = MoneyVaultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        #to get the user that is actually interacting with this view
        user = self.request.user
        #MoneyVault.objects.all to return all notes 
        #filter to filter through and return only the ones written by the user
        return MoneyVault.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class MoneyVaultDelete(generics.DestroyAPIView):
    serializer_class = MoneyVaultSerializer
    permission_classes = [IsAuthenticated]

    #can only delete vaults the user owns 
    def get_queryset(self):
        user = self.request.user
        return MoneyVault.objects.filter(author=user)
    

class CreateUserView(generics.CreateAPIView):
    # specifies the list of objects we need to check to not create preexisting user 
    queryset = User.objects.all
    #tells the data what kind of data we need to accept 
    serializer_class = UserSerializer 
    #who can access
    permission_classes = [AllowAny]

class ChallengeListCreateView(generics.ListCreateAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Challenge.objects.all()

    def perform_create(self, serializer):
        serializer.save()

class JoinChallengeView(generics.UpdateAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Challenge.objects.all()

    def update(self, request, *args, **kwargs):
        challenge = self.get_object()
        challenge.participants.add(request.user)
        challenge.save()
        return Response({"message": "You have joined the challenge successfully!"})

class ChallengeListView(generics.ListAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Challenge.objects.all()
