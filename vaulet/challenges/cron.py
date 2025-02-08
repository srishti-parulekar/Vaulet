from django.utils.timezone import now
from datetime import timedelta
from .models import Challenge
from api.models import UserPerformance
from decimal import Decimal

WEEKLY_CHALLENGE_TEMPLATE = {
    "title": "Weekly Savings Challenge",
    "description": "Save a specified amount over the course of this week to build healthy financial habits.",
    "challenge_type": "WEEKLY",
    "is_automated": True,
}

MONTHLY_CHALLENGE_TEMPLATE = {
    "title": "Monthly Savings Challenge",
    "description": "Set a goal and work throughout the month to reach your savings target.",
    "challenge_type": "MONTHLY",
    "is_automated": True,
}

def calculate_target(current_contributions, increase_factor, min_amount):
    if current_contributions == 0:
        return Decimal(str(min_amount))
    return max(
        current_contributions * Decimal(str(increase_factor)),
        Decimal(str(min_amount))
    )

def create_weekly_challenges():
    print("Creating weekly challenges...")
    users = UserPerformance.objects.all()
    current_time = now()
    
    for user_perf in users:
        existing_challenge = Challenge.objects.filter(
            user=user_perf.user,
            challenge_type='WEEKLY',
            is_automated=True,
            end_date__gt=current_time
        ).exists()
        
        if not existing_challenge:
            target = calculate_target(user_perf.weekly_contributions, 1.1, 50)
            
            Challenge.objects.create(
                user=user_perf.user,
                title=WEEKLY_CHALLENGE_TEMPLATE["title"],
                description=WEEKLY_CHALLENGE_TEMPLATE["description"],
                challenge_type=WEEKLY_CHALLENGE_TEMPLATE["challenge_type"],
                is_automated=WEEKLY_CHALLENGE_TEMPLATE["is_automated"],
                start_date=current_time,
                end_date=current_time + timedelta(minutes=10),
                target_amount=target
            )
            user_perf.last_challenge_created = current_time
            user_perf.save()

def create_monthly_challenges():
    print("Creating monthly challenges...")
    users = UserPerformance.objects.all()
    current_time = now()
    
    for user_perf in users:
        existing_challenge = Challenge.objects.filter(
            user=user_perf.user,
            challenge_type='MONTHLY',
            is_automated=True,
            end_date__gt=current_time
        ).exists()
        
        if not existing_challenge:
            target = calculate_target(user_perf.monthly_contributions, 1.2, 200)
            
            Challenge.objects.create(
                user=user_perf.user,
                title=MONTHLY_CHALLENGE_TEMPLATE["title"],
                description=MONTHLY_CHALLENGE_TEMPLATE["description"],
                challenge_type=MONTHLY_CHALLENGE_TEMPLATE["challenge_type"],
                is_automated=MONTHLY_CHALLENGE_TEMPLATE["is_automated"],
                start_date=current_time,
                end_date=current_time + timedelta(minutes=20),
                target_amount=target
            )
            user_perf.last_challenge_created = current_time
            user_perf.save()