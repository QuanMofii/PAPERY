@echo off
:: Checking python 3.11 is install yet?
for /f "tokens=2 delims= " %%a in ('python --version 2^>nul') do set PYTHON_VERSION=%%a
echo AUTO RUN MODE: Detected Python version: %PYTHON_VERSION%
if "%PYTHON_VERSION:~0,4%" == "3.11" (
    echo AUTO RUN MODE: Python 3.11 is detected.
) else (
    echo Python 3.11 is not installed or not set as default.
    echo Please install Python 3.11 and set it as your default Python interpreter.
    exit /b 1
)

@echo off
:: Checking and install Poetry
echo AUTO RUN MODE: Checking if Poetry is installed...
pip show poetry >nul 2>&1
IF ERRORLEVEL 1 (
    echo Poetry is not installed. Installing Poetry...
    pip install poetry
)

:: Configure Poetry to use virtual environments within the project directory
echo AUTO RUN MODE: Configuring Poetry...
poetry config virtualenvs.in-project true

:: Install dependencies via Poetry
echo AUTO RUN MODE: Installing dependencies...
poetry install

echo AUTO RUN MODE: ENV list
poetry env list

:: 
echo AUTO RUN MODE: Run application...
poetry run python src/app/main.py

cd %ROOT_DIR%