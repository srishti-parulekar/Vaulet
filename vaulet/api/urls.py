from django.urls import path
from . import views
from .views import (
    PersonalVaultCreateView,
    PersonalVaultDetailView,
    PersonalVaultUpdateView,
    UserPerformanceView,
)

urlpatterns = [
    path(
        "personal-vault/",
        PersonalVaultCreateView.as_view(),
        name="setup_personal_vault",
    ),
    path(
        "personal-vault/detail/",
        PersonalVaultDetailView.as_view(),
        name="view_personal_vault",
    ),
    path(
        "personal-vault/update/",
        PersonalVaultUpdateView.as_view(),
        name="update_personal_vault",
    ),
    path("performance/", UserPerformanceView.as_view(), name="user-performance"),
]
