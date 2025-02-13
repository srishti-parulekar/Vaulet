from django.db import models
from django.contrib.auth.models import User
from api.models import PersonalVault
from datetime import datetime
from dateutil.relativedelta import relativedelta

class MoneyVaultData(models.Model):
    objects = models.Manager()
    vault = models.ForeignKey('MoneyVault', on_delete=models.CASCADE, related_name="monthly_data")
    month = models.DateField()

    contribution_amount = models.DecimalField(max_digits=10, decimal_places=0, default=0)

    class Meta: 
        unique_together = ['vault', 'month']
        ordering =['-month']

class MoneyVault(models.Model):

    objects = models.Manager()

    title = models.CharField(max_length=20)
    target_amount = models.DecimalField(max_digits=6, decimal_places=2)
    current_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    # auto now add ensures that this information is automatically recorded w/o user input

    # one user can have money moneyVaults. if user deleted, all its vaults deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vaults")
    is_redeemed = models.BooleanField(default=False)

    def get_monthly_data(self,months=6):
        # getting last n months worth of data
        end_date = datetime.now().date().replace(day=1)
        start_date = end_date - relativedelta(months=months-1)

        # getting the existing data
        existing_data = self.monthly_data.filter(
            month__gte=start_date,
            month__lte=end_date
        ).order_by('month')

        # creating a dictionary: 
        data_dict = {data.month: data.contribution_amount for data in existing_data}

        # generate all months in range: 
        result = []
        current_date = start_date
        while current_date<=end_date:
            result.append({
                'month': current_date.strftime('%Y-%m'),
                'contribution' : float(data_dict.get(current_date,0))
            })
            current_date += relativedelta(months=1)

        return result
    def contribute(self, amount):
        """Method to handle contribution to a vault."""
        # first we check the amount in the users personal vault to be sufficient
        try:
            personal_vault = self.user.personal_vault
            if personal_vault.balance >= amount:
                self.current_amount += amount
                personal_vault.balance -= amount

                # need to update the monthly data here
                #  since the user is making a contribution

                today = datetime.now().date()
                # sets the day to the first of the current month.
                month_start = today.replace(day=1)
                monthly_data, created = MoneyVaultData.objects.get_or_create(
                    vault = self, 
                    month = month_start
                )
                monthly_data.contribution_amount += amount 
                monthly_data.save()

                personal_vault.save()
                self.save()
            else:
                raise ValueError("Insufficient funds in personal vault.")
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def refund(self):
        """Refunding on cancellation of money vault"""
        try:
            personal_vault = self.user.personal_vault
            personal_vault.balance += self.current_amount

            # updating mnthly data
            today = datetime.now().date()
            month_start= today.replace(day=1)
            monthly_data, created = MoneyVaultData.objects.get_or_create(
                vault=self,
                month=month_start
            )
            monthly_data.contribution_amount -= self.current_amount
            monthly_data.save()

            self.current_amount = 0.00
            personal_vault.save()
            self.save()
        except PersonalVault.DoesNotExist:
            raise ValueError("User does not have a personal vault.")

    def __str__(self):
        return str(self.title)


