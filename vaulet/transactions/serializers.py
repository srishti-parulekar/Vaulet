from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Transaction 


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'transaction_type', 'amount', 'description', 
                 'created_at', 'challenge', 'vault']
        read_only_fields = ['user', 'created_at']
