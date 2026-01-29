@echo off
echo ======================================================
echo          ASABRI BACKEND NUCLEAR RECOVERY
echo ======================================================
echo [1/4] MEMATIKAN PROSES YANG MENGUNCI FILE...
taskkill /F /IM php.exe /T >nul 2>&1
taskkill /F /IM conhost.exe /T >nul 2>&1

echo [2/4] MEMBERSIHKAN FOLDER KORUP...
cd asabri-app
if exist vendor (
    echo Menghapus folder vendor lama...
    rmdir /s /q vendor
)
if exist composer.lock (
    del /f /q composer.lock
)

echo [3/4] MENGINSTAL ULANG ENGINE (MOHON TUNGGU)...
C:\xampp\php\php.exe ..\composer.phar update --prefer-dist --no-audit --ignore-platform-reqs

echo [4/4] MENYALAKAN SERVER...
C:\xampp\php\php.exe artisan storage:link
C:\xampp\php\php.exe artisan serve
pause
