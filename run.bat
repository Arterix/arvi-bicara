@echo off
title BiCARA ARVI Launcher
set "ROOT=%~dp0"

echo ===================================================
echo   BiCARA (Arvi AI) - English Speaking Assistant
echo ===================================================
echo.

if not exist "%ROOT%backend\venv\Scripts\python.exe" (
  echo Backend environment not found.
  echo Run setup.ps1 first from PowerShell.
  pause
  exit /b 1
)

if not exist "%ROOT%frontend\node_modules" (
  echo Frontend dependencies not found.
  echo Run setup.ps1 first from PowerShell.
  pause
  exit /b 1
)

echo [1/2] Menjalankan Backend FastAPI (Port 8000)...
start "BiCARA Backend (FastAPI)" cmd /k "cd /d "%ROOT%backend" && venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

echo [2/2] Menjalankan Frontend Next.js (Port 3000)...
start "BiCARA Frontend (Next.js)" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo Backend : http://localhost:8000
echo Frontend: http://localhost:3000
echo.
timeout /t 3 /nobreak >nul
start http://localhost:3000
