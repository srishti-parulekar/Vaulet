from django.urls import path
from . import views
from .views import ChallengeContributeView, ChallengeRedeemView

urlpatterns = [
     path("", views.ChallengeListCreateView.as_view(), name="challenges"),
#     path("<int:pk>/complete/",
#          views.ChallengeCompleteView.as_view(),
#          name="challenge-complete"),
     path("join/<int:pk>/",
         views.JoinChallengeView.as_view(),
         name="join-challenge"),
     path("all/", views.ChallengeListView.as_view(), name="all-challenges"),
     path("<int:pk>/contribute/",
         ChallengeContributeView.as_view(),
         name="challenge-contribute"),
     path("<int:pk>/redeem/",
         ChallengeRedeemView.as_view(),
         name="challenge-redeem"),
     
]