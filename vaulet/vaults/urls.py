from django.urls import path
from . import views
from .views import (
  MoneyVaultContributeView,
)

urlpatterns = [
    path(
        "moneyvaults/<int:pk>/contribute/",
        MoneyVaultContributeView.as_view(),
        name="moneyvault-contribute",
    ),
    path("vault/", views.MoneyVaultListCreate.as_view(), name="vaults-list"),
    path(
        "vault/delete/<int:pk>/", views.MoneyVaultDelete.as_view(), name="delete-vault"
    ),
]
