# challenges/management/commands/check_create_challenges.py
from django.core.management.base import BaseCommand
from django.utils.timezone import now
from django.contrib.auth.models import User
from challenges.models import Challenge
from api.models import UserPerformance
from decimal import Decimal
from datetime import timedelta

CHALLENGE_TEMPLATES = {
    'WEEKLY': {
        'title': 'Weekly Savings Challenge',
        'description': 'Save a specified amount over the course of this week to build healthy financial habits.',
        'challenge_type': 'WEEKLY',
        'is_automated': True,
        'duration': timedelta(days=7),
        'increase_factor': Decimal('1.1'),
        'min_amount': Decimal('50')
    },
    'MONTHLY': {
        'title': 'Monthly Savings Challenge',
        'description': 'Set a goal and work throughout the month to reach your savings target.',
        'challenge_type': 'MONTHLY',
        'is_automated': True,
        'duration': timedelta(days=30),
        'increase_factor': Decimal('1.2'),
        'min_amount': Decimal('200')
    }
}
# Django management command is composed by a class named Command which inherits from BaseCommand
class Command(BaseCommand):
    help = 'Check and create challenges for users without active challenges'

    def calculate_target(self, current_contributions, increase_factor, min_amount):
        if current_contributions == 0:
            return min_amount
        return max(
            current_contributions * increase_factor,
            min_amount
        )

    def create_challenge_if_needed(self, user, challenge_type):
        current_time = now()
        
        # Get or create user performance record
        user_perf, _ = UserPerformance.objects.get_or_create(user=user)
        
        # Check for active challenges
        active_challenge = Challenge.objects.filter(
            user=user,
            challenge_type=challenge_type,
            end_date__gt=current_time
        ).exists()
        
        if not active_challenge:
            template = CHALLENGE_TEMPLATES[challenge_type]
            
            # Calculate target based on challenge type
            contributions = (user_perf.weekly_contributions 
                           if challenge_type == 'WEEKLY' 
                           else user_perf.monthly_contributions)
            
            target = self.calculate_target(
                contributions,
                template['increase_factor'],
                template['min_amount']
            )
            
            Challenge.objects.create(
                user=user,
                title=template['title'],
                description=template['description'],
                challenge_type=template['challenge_type'],
                is_automated=template['is_automated'],
                start_date=current_time,
                end_date=current_time + template['duration'],
                target_amount=target
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Created {challenge_type} challenge for user {user.username}'
                )
            )
            return True
        return False

#The command code should be defined inside the handle() method.
    def handle(self, *args, **kwargs):
        users = User.objects.all()
        weekly_created = 0
        monthly_created = 0
        
        for user in users:
            if self.create_challenge_if_needed(user, 'WEEKLY'):
                weekly_created += 1
            if self.create_challenge_if_needed(user, 'MONTHLY'):
                monthly_created += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Created {weekly_created} weekly and {monthly_created} monthly challenges'
            )
        )