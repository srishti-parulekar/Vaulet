from django.urls import path
from . import views
from .views import (
    PersonalVaultCreateView,
    PersonalVaultDetailView,
    PersonalVaultUpdateView,
)

urlpatterns = [
    path("vault/", views.MoneyVaultListCreate.as_view(), name="vaults-list"),
    path(
        "vault/delete/<int:pk>/", views.MoneyVaultDelete.as_view(), name="delete-vault"
    ),
    path("challenges/", views.ChallengeListCreateView.as_view(), name="challenges"),
    path(
        "challenges/<int:pk>/complete/",
        views.ChallengeCompleteView.as_view(),
        name="challenge-complete",
    ),
    path(
        "challenges/join/<int:pk>/",
        views.JoinChallengeView.as_view(),
        name="join-challenge",
    ),
    path("challenges/all/", views.ChallengeListView.as_view(), name="all-challenges"),
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
]
