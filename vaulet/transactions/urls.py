from django.urls import path
from . import views
from .views import (
    TransactionListView
)

urlpatterns = [
    path("check/", TransactionListView.as_view(), name="transaction-list"),
]

# Example API calls:

# Filter by title (searches both challenge and vault titles)
# GET /api/transactions/?title=savings

# # Filter by amount range
# GET /api/transactions/?min_amount=100&max_amount=500

# # Filter by date range
# GET /api/transactions/?start_date=2024-01-01T00:00:00Z&end_date=2024-02-01T00:00:00Z

# # Filter by transaction type
# GET /api/transactions/?transaction_type=CHALLENGE_CONTRIBUTION

# # Search across titles and description
# GET /api/transactions/?search=vacation

# # Order by amount descending
# GET /api/transactions/?ordering=-amount

# # Combine filters
# GET /api/transactions/?title=savings&min_amount=100&ordering=-created_at