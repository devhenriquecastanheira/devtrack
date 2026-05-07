from rest_framework.decorators import api_view
from rest_framework.response import Response

from projects.models import Project
from topics.models import Topic
from tracks.models import Track


@api_view(['GET'])
def dashboard_summary(request):
    tracks = Track.objects.filter(owner=request.user)
    topics = Topic.objects.filter(track__owner=request.user)
    projects = Project.objects.filter(owner=request.user)

    tracks_count = tracks.count()
    topics_count = topics.count()
    completed_topics_count = topics.filter(completed=True).count()
    pending_topics_count = topics.filter(completed=False).count()
    projects_count = projects.count()
    in_progress_projects_count = projects.filter(
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