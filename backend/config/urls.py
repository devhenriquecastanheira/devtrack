from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tracks.urls')),
    path('api/', include('topics.urls')),
    path('api/', include('projects.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/users/', include('users.urls')),
]