from rest_framework import serializers

from topics.serializers import TopicSerializer
from .models import Track


class TrackSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Track
        fields = [
            'id',
            'owner',
            'title',
            'description',
            'status',
            'topics',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'owner',
            'topics',
            'created_at',
            'updated_at',
        ]