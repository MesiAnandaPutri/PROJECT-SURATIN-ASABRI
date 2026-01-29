@echo off
echo ============================================
echo   ASABRI - Complete Setup Script
echo ============================================
echo.

REM Set PHP Path untuk XAMPP
set PHP_PATH=D:\xampp\php\php.exe

echo Menggunakan PHP: %PHP_PATH%
echo.

cd /d "d:\MAGANG\asabri-app"

echo [1/4] Installing Composer dependencies...
echo Ini mungkin memakan waktu beberapa menit...
"%PHP_PATH%" -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
"%PHP_PATH%" composer-setup.php
"%PHP_PATH%" -r "unlink('composer-setup.php');"
"%PHP_PATH%" composer.phar install --no-interaction
del composer.phar
echo.

echo [2/4] Clearing cache...
"%PHP_PATH%" artisan config:clear
"%PHP_PATH%" artisan cache:clear
echo.

echo [3/4] Running migrations...
"%PHP_PATH%" artisan migrate --force
echo.

echo [4/4] Running seeders...
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
echo Sekarang jalankan: start_server.bat
echo.
pause
