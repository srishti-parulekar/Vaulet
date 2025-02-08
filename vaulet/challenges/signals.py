from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .cron import create_weekly_challenges, create_monthly_challenges

@receiver(post_save, sender=User)
def create_initial_challenges(sender, instance, created, **kwargs):
    if created:
        create_weekly_challenges()
        create_monthly_challenges()