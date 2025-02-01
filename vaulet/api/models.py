from django.db import models 
from django.contrib.auth.models import User 
from django.utils.timezone import now

class MoneyVault(models.Model):

    objects = models.Manager()

    title = models.CharField(max_length=20)
    target_amount = models.DecimalField(max_digits=6, decimal_places=2)
    current_amount = models.DecimalField(max_digits=6, decimal_places=2, null=True, default=0)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    #auto now add ensures that this information is automatically recorded w/o user input 

    #one user can have money moneyVaults. if user deleted, all its vaults deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vaults")

    def contribute(self, amount):
        """Method to handle contribution to a vault."""
        #first we check the amount in the users personal vault to be sufficient
        personal_vault = self.author.personal_vault
        if personal_vault.balance >= amount: 
            self.current_amount += amount
            personal_vault.balance -= amount
            personal_vault.save()
            self.save()
        else:
            raise ValueError("Insufficient funds in personal vault.")

    def refund(self):
        """Refunding on cancellation of money vault"""
        personal_vault = self.author.personal_vault
        personal_vault.balance += self.current_amount
        personal_vault.save()
        self.current_amount = 0.00
        self.save()

    def __str__(self):
        return str(self.title)
    

class Challenge(models.Model):
    objects = models.Manager()

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="challenges")  # The author of the challenge
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    participants = models.ManyToManyField(User, related_name="joined_challenges", blank=True)  # Many-to-Many field to store participants

    def contribute(self, amount):
        personal_vault = self.user.personal_vault
        if personal_vault.balance >= amount:
            personal_vault.balance -= amount
            current_amount += amount 
            self.save()
            personal_vault.save()
        else:
            raise ValueError("Insufficient funds in personal vault.")
        
    def refund(self):
            personal_vault = self.user.personal_vault
            personal_vault.balance += current_amount
            current_amount = 0.00


    def is_active(self):
        # Check if the challenge is still active
        return self.end_date > now()

    def is_completed(self):
        # Check if the challenge has been completed
        return self.current_amount >= self.target_amount

    def __str__(self):
        return str(self.title)

class PersonalVault(models.Model):
    objects = models.Manager()

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="personal_vault")
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username}'s Personal Vault"
    
