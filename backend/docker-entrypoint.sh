#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting application setup..."

# Check if migrations exist, if not, create initial migrations
if [ ! -d "/code/migrations/versions" ] || [ -z "$(find /code/migrations/versions -type f -name '*.py')" ]; then
  echo "No migrations found. Generating initial migration files..."
  alembic revision --autogenerate -m "create initial tables"
fi

# Apply migrations
echo "Applying database migrations..."
alembic upgrade head

# Start the application
exec "$@"