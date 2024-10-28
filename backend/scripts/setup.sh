cd "$(dirname "$0")/.."
poetry install --no-root
poetry shell
alembic upgrade head
python app\main.py