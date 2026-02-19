<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\NotificationController;

Route::post('/login', [ApiController::class, 'login'])->name('api.login');

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [ApiController::class, 'dashboard']);
    Route::get('/enum-options', [ApiController::class, 'getEnumOptions']);
    // Surat Masuk
    Route::get('/surat-masuk', [ApiController::class, 'getSuratMasuk']);
    Route::get('/surat-masuk/{id}', [ApiController::class, 'showSuratMasuk']);
    Route::post('/surat-masuk', [ApiController::class, 'storeSuratMasuk']);
    Route::put('/surat-masuk/{id}', [ApiController::class, 'updateSuratMasuk']);
    Route::delete('/surat-masuk/{id}', [ApiController::class, 'destroySuratMasuk']);
    Route::post('/surat-masuk/{id}/disposisi', [DisposisiController::class, 'store']);
    Route::get('/surat-masuk/{id}/disposisi/download', [DisposisiController::class, 'download']);
    Route::get('/disposisi/{disposisiId}/download', [DisposisiController::class, 'downloadSingle']);
    Route::post('/surat-masuk/import', [ApiController::class, 'importSuratMasukCSV']);
    // Surat Keluar
    Route::get('/surat-keluar', [ApiController::class, 'getSuratKeluar']);
    Route::get('/surat-keluar/{id}', [ApiController::class, 'showSuratKeluar']);
    Route::post('/surat-keluar', [ApiController::class, 'storeSuratKeluar']);
    Route::put('/surat-keluar/{id}', [ApiController::class, 'updateSuratKeluar']);
    Route::delete('/surat-keluar/{id}', [ApiController::class, 'destroySuratKeluar']);
    Route::get('/surat-keluar-next-number', [ApiController::class, 'getNextSuratKeluarNumber']);
    Route::post('/surat-keluar/import', [ApiController::class, 'importSuratKeluarCSV']);
    // User Management
    Route::get('/users', [ApiController::class, 'getUsers']);
    Route::get('/users/{id}', [ApiController::class, 'showUser']);
    Route::post('/users', [ApiController::class, 'storeUser']);
    Route::put('/users/{id}', [ApiController::class, 'updateUser']);
    Route::delete('/users/{id}', [ApiController::class, 'destroyUser']);
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
});
