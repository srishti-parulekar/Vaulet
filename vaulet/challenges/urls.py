from django.urls import path
from . import views
from .views import (
    ChallengeContributeView,
)

urlpatterns = [
    
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
        "challenges/<int:pk>/contribute/",
        ChallengeContributeView.as_view(),
        name="challenge-contribute",
    ),
    ]
