"""
URL configuration for the knowledge_time_machine project.
Includes the timeline app URLs.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('timeline.urls')),  # Include all timeline app routes
]
