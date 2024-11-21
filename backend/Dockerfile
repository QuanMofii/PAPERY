# --------- requirements and migration stage---------

FROM python:3.11 as requirements-stage

WORKDIR /tmp

RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock* /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes


# --------- final image build ---------
FROM python:3.11

WORKDIR /code

COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./src/app /code/app
COPY ./src/migrations /code/migrations
COPY ./src/alembic.ini /code/alembic.ini
COPY ./docker-entrypoint.sh /code/docker-entrypoint.sh

ENTRYPOINT ["/code/docker-entrypoint.sh"]

CMD ["sh", "-c", " uvicorn main:app --host ${BACKEND_HOST} --port ${BACKEND_PORT} ${RELOAD:+--reload}"]
# -------- replace with comment to run with gunicorn --------
# CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker". "-b", "0.0.0.0:8000"]
