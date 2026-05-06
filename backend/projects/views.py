from rest_framework import viewsets

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filterset_fields = ['status']
    search_fields = ['title', 'description', 'technologies']
    ordering_fields = ['title', 'status', 'created_at', 'updated_at']
    ordering = ['-created_at']