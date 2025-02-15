from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Challenge, ChallengeData

class ChallengeDataSerializer(serializers.ModelSerializer): 
    month=serializers.SerializerMethodField()
    contribution = serializers.DecimalField(source='contribution_amount', max_digits=10, decimal_places=2)

    class Meta: 
        model = ChallengeData
        fields = ['month', 'contribution']

    def get_month(self,obj):
        return obj.month.strftime('%b %y')

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
            "is_redeemed"
        ]

    def validate(self, data):
        if data["start_date"] >= data["end_date"]:
            raise serializers.ValidationError("End date must be after the start date.")
        return data
    
    def get_monthly_data(self,obj):
        return obj.get_monthly_data
