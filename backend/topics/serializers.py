from rest_framework import serializers

from .models import Topic


class TopicSerializer(serializers.ModelSerializer):
    track_title = serializers.CharField(source='track.title', read_only=True)

    class Meta:
        model = Topic
        fields = [
            'id',
            'track',
            'track_title',
            'title',
            'description',
            'completed',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'track_title',
            'created_at',
            'updated_at',
        ]