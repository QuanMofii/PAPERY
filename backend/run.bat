@echo off
:: Lưu thư mục gốc hiện tại
set ROOT_DIR=%cd%

:: Điều hướng đến thư mục src
echo src
cd src/app

:: Đọc các biến môi trường từ file .env
for /f "tokens=1,2 delims==" %%A in (.env) do (
    if "%%A"=="BACKEND_HOST" set BACKEND_HOST=%%B
    if "%%A"=="BACKEND_PORT" set BACKEND_PORT=%%B
)

:: Chạy ứng dụng với uvicorn
uvicorn app.main:app --host %BACKEND_HOST% --port %BACKEND_PORT% --reload

:: Quay lại thư mục gốc
cd %ROOT_DIR%
