from pickle import TRUE
from django.db import models
from django.contrib.auth.models import User
from challenges.models import Challenge
from vaults.models import MoneyVault
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('CHALLENGE_CONTRIBUTION', 'Challenge Contribution'),
        ('CHALLENGE_REFUND', 'Challenge Refund'),
        ('VAULT_CONTRIBUTION', 'Vault Contribution'),
        ('VAULT_REFUND', 'Vault Refund'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=25, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional foreign keys to related models
    challenge = models.ForeignKey(Challenge, on_delete=models.SET_NULL, null=True, blank=True)
    vault = models.ForeignKey(MoneyVault, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.amount}"
  

