from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    challenge_id = serializers.IntegerField(source='challenge.id', read_only=True, allow_null=True)
    vault_id = serializers.IntegerField(source='vault.id', read_only=True, allow_null=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id',
            'user',
            'transaction_type',
            'amount',
            'description',
            'created_at',
            'challenge_id',
            'vault_id',
            'challenge_title',
            'vault_title'
        ]
        read_only_fields = ['user', 'challenge_title', 'vault_title']