#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

chown -R appuser:appuser /app/staticfiles

# Run database migrations
gosu appuser python manage.py migrate --noinput

# Collect static files
gosu appuser python manage.py collectstatic --noinput

# Execute the command passed as CMD in the Dockerfile or docker-compose.yml
exec gosu appuser "$@"