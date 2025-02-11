from django.db import models
from django.contrib.auth.models import User
from api.models import PersonalVault

class MoneyVault(models.Model):

    objects = models.Manager()

    title = models.CharField(max_length=20)
    target_amount = models.DecimalField(max_digits=6, decimal_places=2)
    current_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    # auto now add ensures that this information is automatically recorded w/o user input

    # one user can have money moneyVaults. if user deleted, all its vaults deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vaults")
    is_redeemed = models.BooleanField(default=False)
    def contribute(self, amount):
        """Method to handle contribution to a vault."""
        # first we check the amount in the users personal vault to be sufficient
        try:
            personal_vault = self.author.personal_vault
            if personal_vault.balance >= amount:
                self.current_amount += amount
                personal_vault.balance -= amount
                personal_vault.save()
                self.save()
            else:
                raise ValueError("Insufficient funds in personal vault.")
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def refund(self):
        """Refunding on cancellation of money vault"""
        try:
            personal_vault = self.user.personal_vault
            personal_vault.balance += self.current_amount
            self.current_amount = 0.00
            personal_vault.save()
            self.save()
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def __str__(self):
        return str(self.title)

