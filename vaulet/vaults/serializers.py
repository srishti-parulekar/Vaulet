from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MoneyVault, MoneyVaultData

class MoneyVaultDataSerializer(serializers.ModelSerializer):
    class Meta: 
        model = MoneyVaultData
        fields = [
            'month',
            'contribution_amount'
        ]

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

        def get_monthly_data(self, obj):
            return obj.get_monthly_data()
