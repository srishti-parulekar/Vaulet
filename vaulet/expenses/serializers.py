from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PersonalVault, UserPerformance, Transaction, Expense

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'user', 'name', 'amount', 'category', 'necessity_level',
                 'date', 'description', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero")
        return value
