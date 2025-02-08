from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MoneyVault, Challenge, PersonalVault, UserPerformance, Transaction, Expense


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user




class ChallengeSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )

    class Meta:
        model = Challenge
        fields = [
            "id",
            "title",
            "description",
            "start_date",
            "end_date",
            "target_amount",
            "current_amount",
            "participants",
        ]

    def validate(self, data):
        if data["start_date"] >= data["end_date"]:
            raise serializers.ValidationError("End date must be after the start date.")
        return data


class UserPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPerformance
        fields = [
            "total_contributions",
            "weekly_contributions",
            "monthly_contributions",
            "last_challenge_created",
        ]
        read_only_fields = (
            fields  # all fields read-only since they're updated automatically
        )

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'transaction_type', 'amount', 'description', 
                 'created_at', 'challenge', 'vault']
        read_only_fields = ['user', 'created_at']

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

class PersonalVaultSerializer(serializers.ModelSerializer):
    masked_number = serializers.SerializerMethodField()

    class Meta:
        model = PersonalVault
        fields = [
            "id",
            "masked_number",
            "number",
            "expiry",
            "name",
            "balance",
            "user",
            "cvc",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "masked_number": {"read_only": True},
        }

    def get_masked_number(self, obj):
        """Return masked card number for display"""
        if isinstance(obj, dict):
            number = obj.get("number")
        else:
            number = obj.number

        return f"**** **** **** {number[-4:]}" if number else None

    def validate_expiry(self, value):
        """Validate that expiry is in MMYY format and not expired."""
        import re
        from datetime import datetime

        if not re.match(r"^(0[1-9]|1[0-2])\d{2}$", value):
            raise serializers.ValidationError("Expiry must be in MMYY format.")

        current_month = datetime.now().strftime("%m%y")
        if value < current_month:
            raise serializers.ValidationError("Card expiry must be in the future.")
        return value
    
    