from django.urls import path
from .views import (
    ExpenseListCreateView,
    ExpenseStatsView
)

urlpatterns = [
    path("stats/", ExpenseStatsView.as_view(), name="expense-stats"),
    path("check/", ExpenseListCreateView.as_view(), name="expense-list-create"),
]
