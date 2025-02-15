from django.core.management.base import BaseCommand
from challenges.cron import create_weekly_challenges, create_monthly_challenges

class Command(BaseCommand):
    help = 'Create scheduled weekly and monthly challenges'

    def handle(self, *args, **kwargs):
        create_weekly_challenges()
        create_monthly_challenges()
