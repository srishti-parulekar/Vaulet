from django.urls import path
from . import views

urlpatterns = [
    path("vault/", views.MoneyVaultListCreate.as_view(), name="vaults-list"),
    path("vault/delete/<int:pk>/", views.MoneyVaultDelete.as_view(), name="delete-vault")
]

