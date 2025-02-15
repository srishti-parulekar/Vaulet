from calendar import month
from django.db import models
from api.models import PersonalVault
from django.contrib.auth.models import User
from django.utils.timezone import now
from datetime import datetime
from dateutil.relativedelta import relativedelta

CHALLENGE_TYPE_CHOICES = [
    ('WEEKLY', 'Weekly'),
    ('MONTHLY', 'Monthly'),
    ('CUSTOM', 'Custom'),
]

class ChallengeData(models.Model):
    challenge = models.ForeignKey('Challenge', on_delete=models.CASCADE, related_name="monthly_data")  
    objects = models.Manager()
    
    month = models.DateField()
    contribution_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta: 
        unique_together = ['challenge', 'month']
        ordering = ['-month']


class Challenge(models.Model):
    objects = models.Manager()
    challenge_type = models.CharField(max_length=10, choices=CHALLENGE_TYPE_CHOICES, default='CUSTOM')
    is_automated = models.BooleanField(default=False)

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="challenges"
    )  # The author of the challenge
    title = models.CharField(max_length=100)

    description = models.TextField()

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    participants = models.ManyToManyField(
        User, related_name="joined_challenges", blank=True
    )  # Many-to-Many field to store participants

    is_redeemed = models.BooleanField(default=False)

    def contribute(self, amount):
        try:
            personal_vault = self.user.personal_vault
            if personal_vault.balance >= amount:
                personal_vault.balance -= amount
                self.current_amount += amount
                self.user.userperformance.total_contributions += amount
                self.user.userperformance.weekly_contributions += amount
                self.user.userperformance.monthly_contributions += amount

                # update the monthly_data: 
                today = datetime.now().date()
                month_start = today.replace(day=1)

                monthly_data, created = ChallengeData.objects.get_or_create(
                    challenge=self,
                    month=month_start,
                    defaults={'contribution_amount': 0}
                )

                monthly_data.contribution_amount += amount
                monthly_data.save() 

                self.save()
                self.user.userperformance.save()
                personal_vault.save()

            else:
                raise ValueError("Insufficient funds in personal vault.")
            
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")
        

    @property
    def get_monthly_data(self):
        months = 6

        end_date = datetime.now().date().replace(day=1)
        start_date = end_date - relativedelta(months = months - 1)

        # getting existing data: 

        existing_data = self.monthly_data.filter(
            month__gte = start_date,
            month__lte = end_date
        ).order_by('month')

        # creating a dictionary 
        data_dict = {data.month.strftime('%Y-%m-%d'): data.contribution_amount for data in existing_data}

        # generate all months in range
        result = []
        current_date = start_date

        while current_date <= end_date:
            result.append({
            'month': current_date.strftime('%b %y'),
            'contribution': float(data_dict.get(current_date.strftime('%Y-%m-%d'), 0))
            })
            current_date += relativedelta(months=1)

        return result


    def refund(self):
        try:
            personal_vault = self.user.personal_vault
            personal_vault.balance += self.current_amount


            #updating monthly
            today = datetime.now().date()
            month_start = today.replace(day=1)

            monthly_data, created = ChallengeData.objects.get_or_create(
                challenge=self,
                month=month_start,
                defaults={'contribution_amount': 0}
            )

            monthly_data.contribution_amount = models.F('contribution_amount') - self.current_amount
            monthly_data.save()
            
            self.current_amount = 0.00
            self.save()
            personal_vault.save()
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def is_active(self):
        # Check if the challenge is still active
        return self.end_date > now()

    def is_completed(self):
        # Check if the challenge has been completed
        return self.current_amount >= self.target_amount

    def __str__(self):
        return str(self.title)
