#!/bin/sh

set -e  # Thoát ngay lập tức nếu có lỗi xảy ra

echo "Starting application setup..."

# Đợi database sẵn sàng
echo "Checking database connection..."
until nc -z db 5432; do
    echo "Waiting for database to be ready..."
    sleep 1
done
echo "Database is up and connected!"

# Kiểm tra migrations và tạo nếu chưa có
if [ ! -d "/code/migrations/versions" ] || [ -z "$(ls -A /code/migrations/versions)" ]; then
    echo "No migrations found. Creating initial migrations..."
    alembic revision --autogenerate -m "create initial tables"
fi

# Chạy migrations
echo "Checking and applying migrations..."
alembic upgrade head

echo "Setup completed successfully!"

# Khởi động ứng dụng
exec "$@" 