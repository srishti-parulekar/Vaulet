from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MoneyVault, Challenge, PersonalVault


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


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
            "author",
        ]
        extra_kwargs = {"author": {"read_only": True}}


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
            number = obj.get('number')
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