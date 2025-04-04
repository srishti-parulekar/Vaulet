from pickle import TRUE
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


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


