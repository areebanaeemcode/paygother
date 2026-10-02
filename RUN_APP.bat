@echo off
title Pay-Together - Smart Travel Expense Management
echo ========================================================
echo   Pay-Together - Group Expense Sharing Platform (FYP)
echo ========================================================
echo.

cd /d "%~dp0FYP"

:: Detect Python executable
if exist "venv310\Scripts\python.exe" (
    set "PYTHON_EXE=venv310\Scripts\python.exe"
) else if exist "venv\Scripts\python.exe" (
    set "PYTHON_EXE=venv\Scripts\python.exe"
) else (
    echo [INFO] Setting up virtual environment...
    python -m venv venv
    set "PYTHON_EXE=venv\Scripts\python.exe"
    echo [INFO] Installing dependencies (this may take a minute)...
    "%PYTHON_EXE%" -m pip install -r requirements.txt
)

:: Check if .env exists, if not copy from .env.example
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Initializing .env configuration...
        copy .env.example .env >nul
    )
)

:: Ensure database tables are created
echo [INFO] Running migrations...
"%PYTHON_EXE%" manage.py migrate --noinput

:: Automatically launch browser
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://127.0.0.1:8000/"

echo.
echo ========================================================
echo   Pay-Together is LIVE!
echo   Landing Page:  http://127.0.0.1:8000/
echo   Client Portal: http://127.0.0.1:8000/client/
echo   Django Admin:  http://127.0.0.1:8000/admin/
echo ========================================================
echo.

"%PYTHON_EXE%" manage.py runserver 127.0.0.1:8000
pause
