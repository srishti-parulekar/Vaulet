from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserPerformance
from .cron import create_weekly_challenges, create_monthly_challenges

@receiver(post_save, sender=User)
def create_user_performance(sender, instance, created, **kwargs):
    if created:
        UserPerformance.objects.create(user=instance)
        # Create initial challenges for new user
        create_weekly_challenges()
        create_monthly_challenges()