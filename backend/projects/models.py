from django.conf import settings
from django.db import models


class Project(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planejamento'),
        ('in_progress', 'Em desenvolvimento'),
        ('paused', 'Pausado'),
        ('completed', 'Concluído'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    )

    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    repository_url = models.URLField(blank=True)
    deploy_url = models.URLField(blank=True)
    technologies = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='planning'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title