from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('FOOD', 'Food & Dining'),
        ('TRANSPORT', 'Transportation'),
        ('UTILITIES', 'Utilities'),
        ('SHOPPING', 'Shopping'),
        ('ENTERTAINMENT', 'Entertainment'),
        ('HEALTH', 'Healthcare'),
        ('EDUCATION', 'Education'),
        ('OTHER', 'Other'),
    ]
    
    NECESSITY_LEVELS = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Essential'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    necessity_level = models.IntegerField(
        choices=NECESSITY_LEVELS,
        validators=[MinValueValidator(1), MaxValueValidator(4)]
    )
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.name} - {self.amount}"
  