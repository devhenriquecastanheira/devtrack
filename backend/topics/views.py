from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from common.permissions import IsTopicOwner
from .models import Topic
from .serializers import TopicSerializer


class TopicViewSet(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated, IsTopicOwner]
    filterset_fields = ['track', 'completed']
    search_fields = ['title', 'description', 'track__title']
    ordering_fields = ['title', 'completed', 'order', 'created_at', 'updated_at']
    ordering = ['order', 'created_at']

    def get_queryset(self):
        return (
            Topic.objects
            .select_related('track')
            .filter(track__owner=self.request.user)
        )