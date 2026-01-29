@echo off
echo ================================================================
echo   ASABRI - FINAL FIX: Download Pre-built Vendor
echo ================================================================
echo.
echo MASALAH: PHP 8.0.30 tidak kompatibel dengan Composer dependencies
echo SOLUSI: Download vendor folder yang sudah di-build untuk PHP 8.0
echo.
echo ================================================================
echo   LANGKAH MANUAL:
echo ================================================================
echo.
echo 1. Download vendor.zip dari Google Drive:
echo    https://drive.google.com/uc?id=VENDOR_ZIP_ID
echo.
echo 2. Extract vendor.zip ke folder:
echo    d:\MAGANG\asabri-app\
echo.
echo 3. Pastikan struktur folder:
echo    d:\MAGANG\asabri-app\vendor\
echo    d:\MAGANG\asabri-app\vendor\autoload.php
echo.
echo 4. Run server lagi dengan start_server.bat
echo.
echo ================================================================
echo   ALTERNATIF: Install Laravel dengan Composer Global
echo ================================================================
echo.
echo Jika punya akses internet, run command ini:
echo.
echo D:\xampp\php\php.exe -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
echo D:\xampp\php\php.exe composer-setup.php --install-dir=D:\xampp\php --filename=composer
echo D:\xampp\php\composer global require laravel/installer
echo.
pause
