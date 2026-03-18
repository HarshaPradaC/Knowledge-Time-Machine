"""
Views for the Knowledge Time Machine timeline app.

Handles:
- Home page (search UI)
- Timeline page (visualization UI)
- API endpoint (JSON data for the timeline)
"""

import logging

from django.http import JsonResponse
from django.shortcuts import render

from .models import Topic, KnowledgeEvent
from .services import generate_timeline

logger = logging.getLogger(__name__)


def home(request):
    """
    Render the home page with the search bar.
    Also passes recently searched topics for quick access.
    """
    recent_topics = Topic.objects.all()[:8]  # Show up to 8 recent topics
    return render(request, 'home.html', {'recent_topics': recent_topics})


def timeline_page(request):
    """
    Render the timeline visualization page.
    The actual data is fetched by JavaScript via the API endpoint.
    """
    topic = request.GET.get('topic', '')
    return render(request, 'timeline.html', {'topic': topic})


def api_timeline(request):
    """
    API endpoint that returns timeline events as JSON.

    Flow:
    1. Check if the topic already exists in the database.
    2. If yes, return cached events from SQLite.
    3. If no, call Gemini API, store events, and return them.

    Query params:
        topic (str): The knowledge topic to generate/retrieve a timeline for.

    Returns:
        JsonResponse with a list of event objects sorted by year.
    """
    topic_name = request.GET.get('topic', '').strip()

    # Validate input
    if not topic_name:
        return JsonResponse(
            {'error': 'Please provide a topic parameter.'},
            status=400
        )

    try:
        # Step 1: Check if topic already exists in the database
        topic_obj = Topic.objects.filter(name__iexact=topic_name).first()

        if topic_obj:
            # Step 2: Topic exists — return cached events
            logger.info(f"Returning cached timeline for: {topic_name}")
            events = list(
                topic_obj.events.values(
                    'title', 'year', 'description', 'category'
                ).order_by('year')
            )
            return JsonResponse(events, safe=False)

        # Step 3: Topic doesn't exist — call Gemini API
        logger.info(f"Generating new timeline for: {topic_name}")
        events_data = generate_timeline(topic_name)

        # Step 4: Store the topic and events in the database
        topic_obj = Topic.objects.create(name=topic_name)

        for event_data in events_data:
            KnowledgeEvent.objects.create(
                topic=topic_obj,
                title=event_data['title'],
                description=event_data['description'],
                year=event_data['year'],
                category=event_data['category'],
            )

        # Step 5: Return the events as JSON
        events = list(
            topic_obj.events.values(
                'title', 'year', 'description', 'category'
            ).order_by('year')
        )
        return JsonResponse(events, safe=False)

    except ValueError as e:
        # Handle Gemini API configuration or parsing errors
        logger.error(f"ValueError generating timeline: {e}")
        return JsonResponse({'error': str(e)}, status=500)

    except Exception as e:
        # Handle unexpected errors — include the real message for debugging
        logger.error(f"Unexpected error generating timeline: {e}", exc_info=True)
        return JsonResponse(
            {'error': f'Error: {str(e)}'},
            status=500
        )
