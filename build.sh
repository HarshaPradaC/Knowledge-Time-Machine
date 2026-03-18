#!/usr/bin/env bash
# build.sh — Run by Render during the build phase

set -o errexit  # Exit on any error

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate
