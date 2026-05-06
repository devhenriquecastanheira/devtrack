from rest_framework import viewsets

from .models import Track
from .serializers import TrackSerializer


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.prefetch_related('topics').all().order_by('-created_at')
    serializer_class = TrackSerializer
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'status', 'created_at', 'updated_at']
    ordering = ['-created_at']