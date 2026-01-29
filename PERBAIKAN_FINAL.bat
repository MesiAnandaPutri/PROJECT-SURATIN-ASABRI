@echo off
title PERBAIKAN BACKEND ASABRI - FINAL
color 0A
echo.
echo ============================================================
echo                  PERBAIKAN BACKEND ASABRI
echo ============================================================
echo.
echo [STEP 1/5] Mematikan semua proses PHP yang mengganggu...
taskkill /F /IM php.exe >nul 2>&1
timeout /t 2 >nul

echo [STEP 2/5] Menghapus folder vendor yang korup...
cd /d D:\MAGANG\asabri-app
if exist vendor (
    echo Menghapus vendor... Mohon tunggu...
    rd /s /q vendor
)
if exist composer.lock (
    del /f /q composer.lock
)
timeout /t 1 >nul

echo [STEP 3/5] Mengunduh dependencies Laravel...
echo PENTING: Proses ini memakan waktu 5-10 menit!
echo Jangan tutup jendela ini sampai muncul tulisan SUKSES!
echo.
C:\xampp\php\php.exe D:\MAGANG\composer.phar install --prefer-dist --no-scripts --no-dev

echo.
echo [STEP 4/5] Memeriksa hasil instalasi...
if exist vendor\autoload.php (
    echo.
    echo ============================================================
    echo              SUKSES! Vendor folder berhasil dibuat!
    echo ============================================================
    echo.
    echo [STEP 5/5] Memulai Laravel Server...
    echo.
    echo Server akan berjalan di: http://127.0.0.1:8000
    echo Tekan CTRL+C untuk menghentikan server.
    echo.
    C:\xampp\php\php.exe artisan serve
) else (
    echo.
    echo ============================================================
    echo                    GAGAL!
    echo ============================================================
    echo Vendor folder TIDAK terbentuk.
    echo.
    echo SOLUSI DARURAT:
    echo 1. RESTART laptop Anda SEKARANG
    echo 2. Setelah restart, jalankan file ini lagi
    echo.
    pause
)
