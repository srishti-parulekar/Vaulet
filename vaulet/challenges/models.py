from django.db import models
from api.models import PersonalVault
from django.contrib.auth.models import User
from django.utils.timezone import now


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
