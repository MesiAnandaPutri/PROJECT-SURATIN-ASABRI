@echo off
echo ======================================================
echo          ASABRI - FIX VENDOR FOLDER
echo ======================================================
echo.

REM Set paths
set PHP_PATH=D:\xampp\php\php.exe
set COMPOSER_PATH=D:\MAGANG\composer.phar

cd /d "d:\MAGANG\asabri-app"

echo [1/3] Clearing old vendor folder...
if exist vendor (
    echo Removing old vendor folder...
    rmdir /s /q vendor
)
if exist composer.lock (
    del /f /q composer.lock
)
echo.

echo [2/3] Installing dependencies (this may take a few minutes)...
"%PHP_PATH%" "%COMPOSER_PATH%" install --no-interaction --ignore-platform-reqs
echo.

echo [3/3] Running setup...
"%PHP_PATH%" artisan config:clear
"%PHP_PATH%" artisan migrate --force
"%PHP_PATH%" artisan db:seed --force
echo.

echo ======================================================
echo SUKSES! Vendor folder berhasil dibuat!
echo ======================================================
echo.
echo Test users:
echo - admin@asabri.co.id / password
echo - staff@asabri.co.id / password
echo - pimpinan@asabri.co.id / password
echo.
echo Sekarang jalankan: start_server.bat
echo.
pause
