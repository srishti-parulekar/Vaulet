from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MoneyVault, Challenge

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class MoneyVaultSerializer(serializers.ModelSerializer):
    class Meta: 
        model = MoneyVault
        fields = ["id", "title", "description", "target_amount", "current_amount", "created_at", "author"]
        extra_kwargs = {"author": {"read_only" : True}}

class ChallengeSerializer(serializers.ModelSerializer):
    participants = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Challenge
        fields = ["id", "title", "description", "target_amount", "duration_days", "participants", "created_at"]
        read_only_fields = ["participants", "created_at"]

