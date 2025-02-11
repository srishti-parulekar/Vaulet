from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MoneyVault

class MoneyVaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoneyVault
        fields = [
            "id",
            "title",
            "description",
            "target_amount",
            "current_amount",
            "created_at",
            "user",
            "is_redeemed"
        ]
        extra_kwargs = {"user": {"read_only": True}}
