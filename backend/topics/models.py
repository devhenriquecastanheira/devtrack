from django.db import models

from tracks.models import Track


class Topic(models.Model):
    track = models.ForeignKey(
        Track,
        on_delete=models.CASCADE,
        related_name='topics'
    )
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title