from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import MoneyVault
from django.contrib.auth.models import User
from .serializers import MoneyVaultSerializer
from django.shortcuts import get_object_or_404



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

