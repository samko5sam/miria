@echo off
REM Script to start both frontend and backend development servers simultaneously

echo Starting Miria development servers...

REM --- BACKEND ---
echo Starting Flask backend server...
REM 1. Opens new window titled "Miria Backend"
REM 2. Changes directory to "backend"
REM 3. Checks for .venv inside backend OR in the root (..) and activates it
REM 4. Runs flask
start "Miria Backend" cmd /k "cd /d %~dp0backend && (if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else if exist ..\.venv\Scripts\activate.bat (call ..\.venv\Scripts\activate.bat)) && flask run --debug"

REM Give the backend a moment to start
timeout /t 2 /nobreak >nul

REM --- FRONTEND ---
echo Starting Vite frontend server...
REM 1. Opens new window titled "Miria Frontend"
REM 2. Changes directory to "frontend"
REM 3. Runs npm
start "Miria Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are now running in separate windows!
echo Press Ctrl+C in each window to stop the servers...