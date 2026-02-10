@echo off
echo Starting Backend...
start "Laravel Backend" cmd /k "cd asabri-backend && php artisan serve"

echo Starting Frontend...
start "React Frontend" cmd /k "cd asabri-frontend && npm run dev"

echo App is starting...
echo Frontend: http://localhost:5173
echo Backend: http://127.0.0.1:8000
pause
