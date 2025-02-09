from django.urls import path
from . import views
from .views import (
  MoneyVaultContributeView,
  MoneyVaultRedeemView
)

urlpatterns = [
    path(
        "<int:pk>/contribute/",
        MoneyVaultContributeView.as_view(),
        name="moneyvault-contribute",
    ),
    path(
        "<int:pk>/redeem/",
        MoneyVaultRedeemView.as_view(),
        name="moneyvault-redeem",
    ),
    path("check/", views.MoneyVaultListCreate.as_view(), name="vaults-list"),
    path(
        "delete/<int:pk>/", views.MoneyVaultDelete.as_view(), name="delete-vault"
    ),
]
