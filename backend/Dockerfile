# --------- requirements ---------
FROM python:3.11 as requirements-stage

WORKDIR /tmp

RUN pip install poetry poetry-plugin-export

COPY ./pyproject.toml ./poetry.lock* /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# --------- final image build ---------
FROM python:3.11

WORKDIR /code

# Install netcat for database connection checking
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy application code
COPY ./src/app /code/app
COPY ./src/migrations /code/migrations
COPY ./src/alembic.ini /code/alembic.ini
COPY ./src/scripts/check_and_run_migrations.sh /code/scripts/check_and_run_migrations.sh

# Make the script executable
RUN chmod +x /code/scripts/check_and_run_migrations.sh

# Use the script as entrypoint
ENTRYPOINT ["/code/scripts/check_and_run_migrations.sh"]

# Default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
