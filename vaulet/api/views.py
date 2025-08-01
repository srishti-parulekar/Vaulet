from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import (
    PersonalVaultSerializer,
    UserSerializer,
    UserPerformanceSerializer,
)
from .models import PersonalVault, UserPerformance
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class CreateUserView(generics.CreateAPIView):
    # specifies the list of objects we need to check to not create preexisting user
    queryset = User.objects.all()
    # tells the data what kind of data we need to accept
    serializer_class = UserSerializer
    # who can access
    permission_classes = [AllowAny]
    authentication_classes = []


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

