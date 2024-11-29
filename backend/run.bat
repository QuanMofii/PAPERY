@echo off
set ROOT_DIR=%cd%

echo src
cd src/app

for /f "tokens=1,2 delims==" %%A in (.env) do (
    if "%%A"=="BACKEND_HOST" set BACKEND_HOST=%%B
    if "%%A"=="BACKEND_PORT" set BACKEND_PORT=%%B
)

uvicorn app.main:app --host %BACKEND_HOST% --port %BACKEND_PORT% --reload

cd %ROOT_DIR%
