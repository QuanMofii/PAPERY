@echo off
:: Update and install Poetry
echo Installing Poetry...
pip install poetry

:: Configure Poetry to use virtual environments within the project directory
echo Configuring Poetry...
poetry config virtualenvs.in-project true

echo Create Poetry Lock...
poetry lock

:: Install dependencies via Poetry
echo Installing dependencies...
poetry install

:: Setup completed
echo Finish setup...
