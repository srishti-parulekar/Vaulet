# vaulet/celery.py
import os
from celery import Celery
from celery.schedules import crontab
from django.conf import settings

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vaulet.settings')

app = Celery('vaulet')

# Configure Celery using Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Set up the beat schedule
app.conf.beat_schedule = {
    'create-weekly-challenges': {
        'task': 'challenges.tasks.create_scheduled_weekly_challenges',
        'schedule': 120.0,  # 2 minutes
    },
    'create-monthly-challenges': {
        'task': 'challenges.tasks.create_scheduled_monthly_challenges',
        'schedule': 300.0,  # 5 minutes
    },
}

# Auto-discover tasks in all installed apps
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')