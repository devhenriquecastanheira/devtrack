from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tracks.urls')),
    path('api/', include('topics.urls')),
    path('api/', include('projects.urls')),
]