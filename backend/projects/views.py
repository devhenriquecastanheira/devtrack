from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from common.permissions import IsOwner
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filterset_fields = ['status']
    search_fields = ['title', 'description', 'technologies']
    ordering_fields = ['title', 'status', 'created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return (
            Project.objects
            .filter(owner=self.request.user)
            .order_by('-created_at')
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)