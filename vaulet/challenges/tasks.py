# challenges/tasks.py
from celery import shared_task
from celery.utils.log import get_task_logger
from django.db import transaction
from .models import Challenge
from api.models import User
from api.models import UserPerformance
from .cron import create_challenge
from django.utils.timezone import now

logger = get_task_logger(__name__)

@shared_task
def create_scheduled_weekly_challenges():
    """
    Celery task to create weekly challenges for all users
    """
    logger.info("Starting scheduled weekly challenges creation")
    try:
        user_perfs = UserPerformance.objects.all()
        logger.info(f"Found {user_perfs.count()} user performance records")
        
        count = 0
        for user_perf in user_perfs:
            logger.info(f"Processing user {user_perf.user.username}")
            
            # Check existing challenges
            existing = Challenge.objects.filter(
                user=user_perf.user,
                challenge_type='WEEKLY',
                is_automated=True,
                end_date__gt=now()
            ).count()
            logger.info(f"User has {existing} active weekly challenges")
            
            try:
                with transaction.atomic():
                    result = create_challenge('WEEKLY', user_perf)
                    if result:
                        count += 1
                        logger.info(f"Successfully created weekly challenge for user {user_perf.user.username}")
                    else:
                        logger.info(f"No new challenge created for user {user_perf.user.username} (likely has active challenge)")
            except Exception as e:
                logger.error(f"Error creating challenge for user {user_perf.user.username}: {str(e)}")
        
        logger.info(f"Total weekly challenges created: {count}")
        return count
    except Exception as e:
        logger.error(f"Error in weekly challenge creation: {str(e)}")
        raise

@shared_task
def create_scheduled_monthly_challenges():
    """
    Celery task to create monthly challenges for all users
    """
    logger.info("Starting scheduled monthly challenges creation")
    try:
        user_perfs = UserPerformance.objects.all()
        logger.info(f"Found {user_perfs.count()} user performance records")
        
        count = 0
        for user_perf in user_perfs:
            logger.info(f"Processing user {user_perf.user.username}")
            
            # Check existing challenges
            existing = Challenge.objects.filter(
                user=user_perf.user,
                challenge_type='MONTHLY',
                is_automated=True,
                end_date__gt=now()
            ).count()
            logger.info(f"User has {existing} active monthly challenges")
            
            try:
                with transaction.atomic():
                    result = create_challenge('MONTHLY', user_perf)
                    if result:
                        count += 1
                        logger.info(f"Successfully created monthly challenge for user {user_perf.user.username}")
                    else:
                        logger.info(f"No new challenge created for user {user_perf.user.username} (likely has active challenge)")
            except Exception as e:
                logger.error(f"Error creating challenge for user {user_perf.user.username}: {str(e)}")
        
        logger.info(f"Total monthly challenges created: {count}")
        return count
    except Exception as e:
        logger.error(f"Error in monthly challenge creation: {str(e)}")
        raise

@shared_task
def cleanup_duplicate_challenges():
    """Remove duplicate active challenges for users"""
    users = User.objects.all()
    removed_count = 0
    
    for user in users:
        # Process weekly challenges
        weekly_challenges = Challenge.objects.filter(
            user=user,
            challenge_type='WEEKLY',
            is_automated=True,
            end_date__gt=now()
        ).order_by('-created_at')  # Newest first
        
        # Keep only the newest challenge
        if weekly_challenges.count() > 1:
            to_delete = weekly_challenges[1:]  # All but the first one
            count = to_delete.count()
            to_delete.delete()
            removed_count += count
            
        # Same for monthly challenges
        monthly_challenges = Challenge.objects.filter(
            user=user,
            challenge_type='MONTHLY',
            is_automated=True,
            end_date__gt=now()
        ).order_by('-created_at')  # Newest first
        
        if monthly_challenges.count() > 1:
            to_delete = monthly_challenges[1:]  # All but the first one
            count = to_delete.count()
            to_delete.delete()
            removed_count += count
    
    return removed_count