from pickle import TRUE
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator


class PersonalVault(models.Model):
    objects = models.Manager()

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="personal_vault"
    )
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    number = models.CharField(max_length=16)
    expiry = models.CharField(max_length=4)
    cvc = models.CharField(max_length=3)
    name = models.CharField(max_length=50)

    def __str__(self):  # Move this out of the signal handler
        return f"{self.user.username}'s Personal Vault"

    # Remove or comment out these signal handlers


@receiver(post_save, sender=User)
def create_personal_vault(sender, instance, created, **kwargs):
    if created:
        PersonalVault.objects.create(
            user=instance,
            balance=0.00,
            number="",
            expiry="",
            cvc="",
            name="",
        )


@receiver(post_save, sender=User)
def save_personal_vault(sender, instance, **kwargs):
    try:
        instance.personal_vault.save()
    except PersonalVault.DoesNotExist:
        PersonalVault.objects.create(
            user=instance,
            balance=0.00,
            number="",
            expiry="",
            cvc="",
            name="",
        )


class UserPerformance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_contributions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    weekly_contributions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monthly_contributions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    last_challenge_created = models.DateTimeField(auto_now_add=True)


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
    challenge = models.ForeignKey('Challenge', on_delete=models.SET_NULL, null=True, blank=True)
    vault = models.ForeignKey('MoneyVault', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.amount}"

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('FOOD', 'Food & Dining'),
        ('TRANSPORT', 'Transportation'),
        ('UTILITIES', 'Utilities'),
        ('SHOPPING', 'Shopping'),
        ('ENTERTAINMENT', 'Entertainment'),
        ('HEALTH', 'Healthcare'),
        ('EDUCATION', 'Education'),
        ('OTHER', 'Other'),
    ]
    
    NECESSITY_LEVELS = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Essential'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    necessity_level = models.IntegerField(
        choices=NECESSITY_LEVELS,
        validators=[MinValueValidator(1), MaxValueValidator(4)]
    )
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.name} - {self.amount}"
    

