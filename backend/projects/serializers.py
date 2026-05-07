from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id',
            'owner',
            'title',
            'description',
            'repository_url',
            'deploy_url',
            'technologies',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'owner',
            'created_at',
            'updated_at',
        ]