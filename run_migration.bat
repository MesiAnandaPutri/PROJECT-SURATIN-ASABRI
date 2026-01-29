@echo off
cd /d "d:\MAGANG\asabri-app"
echo ============================================
echo   ASABRI - Running Database Migrations
echo ============================================
echo.
echo Database: asabri_mail
echo Host: 127.0.0.1:3308
echo.
echo Running migrations...
echo.
php artisan migrate --force
echo.
echo ============================================
echo Migration selesai!
echo ============================================
pause
