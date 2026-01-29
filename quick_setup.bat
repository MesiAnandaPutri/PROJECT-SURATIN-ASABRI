@echo off
echo ============================================
echo   ASABRI - Quick Setup Script
echo ============================================
echo.

REM Set PHP Path untuk XAMPP
set PHP_PATH=D:\xampp\php\php.exe

echo Menggunakan PHP: %PHP_PATH%
echo.

cd /d "d:\MAGANG\asabri-app"

echo [1/3] Clearing cache...
"%PHP_PATH%" artisan config:clear
"%PHP_PATH%" artisan cache:clear
echo.

echo [2/3] Running migrations...
"%PHP_PATH%" artisan migrate --force
echo.

echo [3/3] Running seeders...
"%PHP_PATH%" artisan db:seed --force
echo.

echo ============================================
echo Setup selesai! Database siap digunakan.
echo ============================================
echo.
echo Test users:
echo - admin@asabri.co.id / password
echo - staff@asabri.co.id / password
echo - pimpinan@asabri.co.id / password
echo.
pause
