from django.contrib import admin

from .models import Topic


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'track',
        'completed',
        'order',
        'created_at',
        'updated_at',
    )
    list_filter = ('completed', 'track', 'created_at')
    search_fields = ('title', 'description', 'track__title')
    ordering = ('track', 'order', 'created_at')