from pickle import TRUE
from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator

class MoneyVault(models.Model):

    objects = models.Manager()

    title = models.CharField(max_length=20)
    target_amount = models.DecimalField(max_digits=6, decimal_places=2)
    current_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    # auto now add ensures that this information is automatically recorded w/o user input

    # one user can have money moneyVaults. if user deleted, all its vaults deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vaults")

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
            personal_vault = self.author.personal_vault
            personal_vault.balance += self.current_amount
            self.current_amount = 0.00
            personal_vault.save()
            self.save()
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def __str__(self):
        return str(self.title)

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


CHALLENGE_TYPE_CHOICES = [
    ('WEEKLY', 'Weekly'),
    ('MONTHLY', 'Monthly'),
    ('CUSTOM', 'Custom'),
]
class Challenge(models.Model):
    objects = models.Manager()
    challenge_type = models.CharField(max_length=10, choices=CHALLENGE_TYPE_CHOICES, default='CUSTOM')
    is_automated = models.BooleanField(default=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="challenges"
    )  # The author of the challenge
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    participants = models.ManyToManyField(
        User, related_name="joined_challenges", blank=True
    )  # Many-to-Many field to store participants

    def contribute(self, amount):
        try:
            personal_vault = self.user.personal_vault
            if personal_vault.balance >= amount:
                personal_vault.balance -= amount
                self.current_amount += amount
                self.user.userperformance.total_contributions += amount
                self.user.userperformance.weekly_contributions += amount
                self.user.userperformance.monthly_contributions += amount
                self.save()
                self.user.userperformance.save()
                personal_vault.save()
            else:
                raise ValueError("Insufficient funds in personal vault.")
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def refund(self):
        try:
            personal_vault = self.user.personal_vault
            personal_vault.balance += self.current_amount
            self.current_amount = 0.00
            self.save()
            personal_vault.save()
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def is_active(self):
        # Check if the challenge is still active
        return self.end_date > now()

    def is_completed(self):
        # Check if the challenge has been completed
        return self.current_amount >= self.target_amount

    def __str__(self):
        return str(self.title)

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
    

