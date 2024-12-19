from django.db import models 
from django.contrib.auth.models import User 

class MoneyVault(models.Model):

    objects = models.Manager()

    title = models.CharField(max_length=20)
    target_amount = models.DecimalField(max_digits=6, decimal_places=2)
    current_amount = models.DecimalField(max_digits=6, decimal_places=2, null=True, default=0)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    #auto now add ensures that this information is automatically recorded w/o user input 

    #one user can have money moneyVaults. if user deleted, all its vaults deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vaults")

    def __str__(self):
        return str(self.title)
