"""
URL configuration for the timeline app.
Maps URLs to their corresponding view functions.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),                    # Home page with search
    path('timeline/', views.timeline_page, name='timeline'),  # Timeline visualization
    path('api/timeline/', views.api_timeline, name='api_timeline'),  # JSON API endpoint
]
