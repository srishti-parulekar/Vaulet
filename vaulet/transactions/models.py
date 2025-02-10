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

    #related name lets us reference user.transactions.all() to fetch all the transactions. 
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=25, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    #auto_now_add automatically sets the timestamp when transaction is created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # storing the title differently so that even if we delete the challenge/vault its still there in the 
    # transaction table
    challenge_title = models.CharField(max_length=100, null=True, blank=True)
    vault_title = models.CharField(max_length=20, null=True, blank=True)

    # if challenge/vault is deleted, this field becomes NULL but transaction remains
    challenge = models.ForeignKey(Challenge, on_delete=models.SET_NULL, null=True, blank=True)
    vault = models.ForeignKey(MoneyVault, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Save the titles before saving the transaction
        if self.challenge and not self.challenge_title:
            self.challenge_title = self.challenge.title
        if self.vault and not self.vault_title:
            self.vault_title = self.vault.title
        super().save(*args, **kwargs)

    def __str__(self):
        entity_title = self.challenge_title if self.challenge_title else self.vault_title if self.vault_title else "Unknown"
        return f"{self.user.username} - {self.transaction_type} - {self.amount} - {entity_title}"