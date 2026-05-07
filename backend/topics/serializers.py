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

    def validate_track(self, track):
        request = self.context.get('request')

        if request and track.owner != request.user:
            raise serializers.ValidationError(
                'Você não pode criar tópicos em uma trilha que não pertence a você.'
            )

        return track