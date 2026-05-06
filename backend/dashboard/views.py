from rest_framework.decorators import api_view
from rest_framework.response import Response

from projects.models import Project
from topics.models import Topic
from tracks.models import Track


@api_view(['GET'])
def dashboard_summary(request):
    tracks_count = Track.objects.count()
    topics_count = Topic.objects.count()
    completed_topics_count = Topic.objects.filter(completed=True).count()
    pending_topics_count = Topic.objects.filter(completed=False).count()
    projects_count = Project.objects.count()
    in_progress_projects_count = Project.objects.filter(
        status='in_progress'
    ).count()

    topics_progress_percentage = 0

    if topics_count > 0:
        topics_progress_percentage = round(
            (completed_topics_count / topics_count) * 100,
            2
        )

    data = {
        'tracks_count': tracks_count,
        'topics_count': topics_count,
        'completed_topics_count': completed_topics_count,
        'pending_topics_count': pending_topics_count,
        'topics_progress_percentage': topics_progress_percentage,
        'projects_count': projects_count,
        'in_progress_projects_count': in_progress_projects_count,
    }

    return Response(data)