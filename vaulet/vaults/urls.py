from django.urls import path
from . import views
from .views import (
  MoneyVaultContributeView,
)

urlpatterns = [
    path(
        "<int:pk>/contribute/",
        MoneyVaultContributeView.as_view(),
        name="moneyvault-contribute",
    ),
    path("check/", views.MoneyVaultListCreate.as_view(), name="vaults-list"),
    path(
        "delete/<int:pk>/", views.MoneyVaultDelete.as_view(), name="delete-vault"
    ),
]
