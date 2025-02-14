from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MoneyVault, MoneyVaultData

class MoneyVaultDataSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()
    contribution = serializers.DecimalField(source='contribution_amount', max_digits=10, decimal_places=2)

    class Meta:
        model = MoneyVaultData
        fields = ['month', 'contribution']

    def get_month(self, obj):
        return obj.month.strftime('%b %y')

class MoneyVaultSerializer(serializers.ModelSerializer):
    monthly_data = serializers.SerializerMethodField()

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
            "is_redeemed",
            "monthly_data"
        ]
        extra_kwargs = {"user": {"read_only": True}}

    def get_monthly_data(self, obj):
        return obj.get_monthly_data