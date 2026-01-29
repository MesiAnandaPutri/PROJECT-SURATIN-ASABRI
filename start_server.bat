@echo off

REM Set PHP Path untuk XAMPP
set PHP_PATH=D:\xampp\php\php.exe

cd /d "d:\MAGANG\asabri-app"
echo ============================================
echo   ASABRI Mail Management System - Server
echo ============================================
echo.
echo PHP Path: %PHP_PATH%
echo.
echo Server akan berjalan di:
echo - Local: http://127.0.0.1:8000
echo - Network: http://0.0.0.0:8000
echo.
echo Tekan CTRL+C untuk menghentikan server
echo ============================================
echo.
"%PHP_PATH%" artisan serve --host=0.0.0.0
pause
