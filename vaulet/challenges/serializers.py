from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Challenge



class ChallengeSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )

    class Meta:
        model = Challenge
        fields = [
            "id",
            "title",
            "description",
            "start_date",
            "end_date",
            "target_amount",
            "current_amount",
            "participants",
        ]

    def validate(self, data):
        if data["start_date"] >= data["end_date"]:
            raise serializers.ValidationError("End date must be after the start date.")
        return data
