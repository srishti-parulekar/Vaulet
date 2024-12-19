from django.contrib.auth.models import User
from rest_framework import serializers
from backend.api.models import MoneyVault

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
        fields = ["title", "description", "target_amount", "current_amount", "created_at", "author"]
        extra_kwargs = {"author": {"read_only" : True}}

    