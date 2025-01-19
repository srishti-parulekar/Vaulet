from django.urls import path
from . import views

urlpatterns = [
    path("vault/", views.MoneyVaultListCreate.as_view(), name="vaults-list"),
    path("vault/delete/<int:pk>/", views.MoneyVaultDelete.as_view(), name="delete-vault"),
    path("challenges/", views.ChallengeListCreateView.as_view(), name="challenge-list"),
    path("challenges/join/<int:pk>/", views.JoinChallengeView.as_view(), name="join-challenge"),
    path("challenges/all/", views.ChallengeListView.as_view(), name="all-challenges"),
]

