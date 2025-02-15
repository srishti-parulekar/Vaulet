from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .cron import create_challenge
from api.models import UserPerformance

@receiver(post_save, sender=User)
def create_initial_challenges(sender, instance, created, **kwargs):
    """Create initial challenges when a new user is created"""
    if created:
        # Create user performance record if it doesn't exist
        user_perf, _ = UserPerformance.objects.get_or_create(user=instance)
        create_challenge('WEEKLY', user_perf)
        create_challenge('MONTHLY', user_perf)
