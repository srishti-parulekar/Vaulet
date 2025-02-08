from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import MoneyVault
from django.contrib.auth.models import User
from .serializers import MoneyVaultSerializer



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
