"""
Groq API integration service for the Knowledge Time Machine.

This module handles communication with Groq's API to generate
chronological timelines of knowledge evolution for any given topic.
"""

import json
import os
import re
import logging

from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)


def generate_timeline(topic: str) -> list[dict]:
    """
    Generate a chronological timeline of milestones for a given topic
    using the Groq API.

    Args:
        topic: The knowledge topic to generate a timeline for.

    Returns:
        A list of dicts, each containing: title, year, description, category.

    Raises:
        ValueError: If the API key is not configured or response parsing fails.
        Exception: If the Groq API call fails.
    """
    # Step 1: Read API key from environment
    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        raise ValueError(
            "GROQ_API_KEY environment variable is not set. "
            "Please set it in your .env file."
        )

    # Step 2: Initialize the Groq client
    client = Groq(api_key=api_key)

    # Step 3: Build the prompt requesting structured JSON output
    prompt = f"""Generate a chronological timeline of the most important milestones in the evolution of {topic}.

Return exactly 12 events.

Return valid JSON only. Do not include any markdown formatting, code fences, or explanatory text.

Each event must include:
- title (string): A concise title for the milestone
- year (integer): The year the milestone occurred
- description (string): A 2-3 sentence description of the milestone and its significance
- category (string): One of the following categories ONLY: Research, Industry, Open Source, Milestone

Return only a JSON array of objects. Example format:
[
  {{"title": "Example Event", "year": 2000, "description": "Description here.", "category": "Research"}}
]"""

    # Step 4: Call the Groq API using llama-3.3-70b-versatile
    logger.info(f"Generating timeline for topic: {topic}")
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a knowledgeable historian and technology expert. Return only valid JSON arrays when asked."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.3,
    )

    # Step 5: Parse the response
    raw_text = chat_completion.choices[0].message.content.strip()
    events = _parse_response(raw_text)

    logger.info(f"Successfully generated {len(events)} events for: {topic}")
    return events


def _parse_response(raw_text: str) -> list[dict]:
    """
    Parse the API response text into a list of event dictionaries.
    Handles cases where the model wraps JSON in markdown code fences.

    Args:
        raw_text: The raw text response from the model.

    Returns:
        A list of event dictionaries.

    Raises:
        ValueError: If the response cannot be parsed as valid JSON.
    """
    # Remove markdown code fences if present (```json ... ``` or ``` ... ```)
    cleaned = re.sub(r'^```(?:json)?\s*\n?', '', raw_text, flags=re.MULTILINE)
    cleaned = re.sub(r'\n?```\s*$', '', cleaned, flags=re.MULTILINE)
    cleaned = cleaned.strip()

    try:
        events = json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse response: {e}")
        logger.error(f"Raw response was: {raw_text[:500]}")
        raise ValueError(
            f"Could not parse API response as JSON: {e}"
        )

    # Validate the structure of each event
    valid_categories = {'Research', 'Industry', 'Open Source', 'Milestone'}
    validated_events = []

    for event in events:
        # Ensure required fields exist
        if not all(k in event for k in ('title', 'year', 'description', 'category')):
            logger.warning(f"Skipping malformed event: {event}")
            continue

        # Normalize category — if model returns unexpected value, default to Milestone
        if event['category'] not in valid_categories:
            event['category'] = 'Milestone'

        # Ensure year is an integer
        try:
            event['year'] = int(event['year'])
        except (ValueError, TypeError):
            logger.warning(f"Skipping event with invalid year: {event}")
            continue

        validated_events.append({
            'title': str(event['title']),
            'year': event['year'],
            'description': str(event['description']),
            'category': str(event['category']),
        })

    if not validated_events:
        raise ValueError("API returned no valid events.")

    # Sort by year chronologically
    validated_events.sort(key=lambda x: x['year'])

    return validated_events
