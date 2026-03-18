"""
Database models for the Knowledge Time Machine timeline app.

Defines Topic and KnowledgeEvent models for storing
AI-generated historical timelines of concepts.
"""

from django.db import models


class Topic(models.Model):
    """
    Represents a knowledge topic that a user has searched for.
    Each topic has a unique name and tracks when it was first created.
    """
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


# Allowed categories for knowledge events
CATEGORY_CHOICES = [
    ('Research', 'Research'),
    ('Industry', 'Industry'),
    ('Open Source', 'Open Source'),
    ('Milestone', 'Milestone'),
]


class KnowledgeEvent(models.Model):
    """
    Represents a single historical event/milestone in the evolution
    of a topic. Linked to a Topic via ForeignKey.
    """
    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='events'
    )
    title = models.CharField(max_length=500)
    description = models.TextField()
    year = models.IntegerField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.year} — {self.title}"

    class Meta:
        ordering = ['year']  # Events sorted chronologically by default
