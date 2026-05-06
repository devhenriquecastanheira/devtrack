from rest_framework import viewsets

from .models import Topic
from .serializers import TopicSerializer


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.select_related('track').all()
    serializer_class = TopicSerializer