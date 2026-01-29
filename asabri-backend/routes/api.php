<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;

Route::post('/login', [ApiController::class, 'login'])->name('api.login');

// Fallback for unauthenticated API requests redirecting to 'login'
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

Route::middleware('auth:sanctum')->group(function () {
    // Surat Masuk
    Route::get('/surat-masuk', [ApiController::class, 'getSuratMasuk']);
    Route::get('/surat-masuk/{id}', [ApiController::class, 'showSuratMasuk']);
    Route::post('/surat-masuk', [ApiController::class, 'storeSuratMasuk']);
    Route::put('/surat-masuk/{id}', [ApiController::class, 'updateSuratMasuk']);
    Route::delete('/surat-masuk/{id}', [ApiController::class, 'destroySuratMasuk']);

    // Surat Keluar
    Route::get('/surat-keluar', [ApiController::class, 'getSuratKeluar']);
    Route::get('/surat-keluar/{id}', [ApiController::class, 'showSuratKeluar']);
    Route::post('/surat-keluar', [ApiController::class, 'storeSuratKeluar']);
    Route::put('/surat-keluar/{id}', [ApiController::class, 'updateSuratKeluar']);
    Route::delete('/surat-keluar/{id}', [ApiController::class, 'destroySuratKeluar']);
});
