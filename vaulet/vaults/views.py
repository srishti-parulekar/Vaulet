from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import MoneyVault
from django.contrib.auth.models import User
from .serializers import MoneyVaultSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from decimal import Decimal
from api.models import PersonalVault
from django.db import transaction


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


class MoneyVaultRedeemView(generics.UpdateAPIView):
    serializer_class = MoneyVaultSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(MoneyVault, id=self.kwargs['pk'])
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        vault = self.get_object()

        #make sure vault hasnt been redeemed and is completed already. 
        if not vault.current_amount >= vault.target_amount:
            return Response({"error" : """Vault hasnt been completed yet!
                             Delete the vault to reinstate the balance into your personal vault."""})
        
        if getattr(vault, "is_redeemed", False):
            return Response({"error" : "Vault has already been redeemed!"})
        
        try:
            #get users personal vault
            personal_vault = PersonalVault.objects.get(user=request.user)

            #updating the personal vault with redeeming value
            personal_vault.balance += vault.current_amount
            personal_vault.save()

            #marking the vault as redeemed 
            vault.is_redeemed = True
            vault.save()

            return Response({
                "message" : "Vault has been redeemed successfully",
                "redeemed_amount" : vault.current_amount,
                "new_personal_vault_balance" : personal_vault.balance })
        
        except PersonalVault.DoesNotExist:
            return Response({"error" : "Personal vault not found"},
                            status=400)
        except Exception as e: 
            return Response({"error": str(e)}, status=400)