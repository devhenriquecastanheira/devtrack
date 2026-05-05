from django.db import models

class Track(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Não iniciada'),
        ('in_progress', 'Em andamento'),
        ('completed', 'Concluída'),
    ]

    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='not_started'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
