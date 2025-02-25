from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils.timezone import now
from datetime import timedelta
from decimal import Decimal
from .models import Challenge
from api.models import UserPerformance

CHALLENGE_TEMPLATES = {
    'WEEKLY': {
        'title': 'Weekly Savings Challenge',
        'description': 'Save a specified amount over the course of this week to build healthy financial habits.',
        'challenge_type': 'WEEKLY',
        'is_automated': True,
        'duration': timedelta(days=7),  # Changed from minutes to days
        'increase_factor': Decimal('1.001'),
        'min_amount': Decimal('50')
    },
    'MONTHLY': {
        'title': 'Monthly Savings Challenge',
        'description': 'Set a goal and work throughout the month to reach your savings target.',
        'challenge_type': 'MONTHLY',
        'is_automated': True,
        'duration': timedelta(days=30),  # Changed from minutes to days
        'increase_factor': Decimal('1.001'),
        'min_amount': Decimal('200')
    }
}

def calculate_target(current_contributions, increase_factor, min_amount):
    """Calculate the target amount for a new challenge based on user's performance"""
    if current_contributions == 0:
        return min_amount
    return max(
        current_contributions * increase_factor,
        min_amount
    )
def create_challenge(challenge_type, user_perf):
    """Create a new challenge for a user based on their performance"""
    template = CHALLENGE_TEMPLATES[challenge_type]
    current_time = now()
    
    # Check for ANY existing active challenge of this type
    existing_challenges_count = Challenge.objects.filter(
        user=user_perf.user,
        challenge_type=challenge_type,
        is_automated=True,
        end_date__gt=current_time
    ).count()
    
    # Only create a new challenge if NO active challenges exist
    if existing_challenges_count == 0:
        # Calculate target based on challenge type
        contributions = (user_perf.weekly_contributions 
                        if challenge_type == 'WEEKLY' 
                        else user_perf.monthly_contributions)
        
        target = calculate_target(
            contributions,
            template['increase_factor'],
            template['min_amount']
        )
        
        # Create new challenge
        Challenge.objects.create(
            user=user_perf.user,
            title=template['title'],
            description=template['description'],
            challenge_type=template['challenge_type'],
            is_automated=template['is_automated'],
            start_date=current_time,
            end_date=current_time + template['duration'],
            target_amount=target
        )
        
        # Update user performance
        user_perf.last_challenge_created = current_time
        user_perf.save()
        
        return True
    return False

def create_weekly_challenges():
    """Create weekly challenges for all users"""
    users = UserPerformance.objects.all()
    created_count = 0
    
    for user_perf in users:
        if create_challenge('WEEKLY', user_perf):
            created_count += 1
    
    print(f"Created {created_count} new weekly challenges")

def create_monthly_challenges():
    """Create monthly challenges for all users"""
    users = UserPerformance.objects.all()
    created_count = 0
    
    for user_perf in users:
        if create_challenge('MONTHLY', user_perf):
            created_count += 1
    
    print(f"Created {created_count} new monthly challenges")
