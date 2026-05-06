from rest_framework import viewsets

from .models import Topic
from .serializers import TopicSerializer


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.select_related('track').all()
    serializer_class = TopicSerializer
    filterset_fields = ['track', 'completed']
    search_fields = ['title', 'description', 'track__title']
    ordering_fields = ['title', 'completed', 'order', 'created_at', 'updated_at']
    ordering = ['order', 'created_at']