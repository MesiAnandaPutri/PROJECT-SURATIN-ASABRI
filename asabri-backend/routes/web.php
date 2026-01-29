<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('surat-masuk', App\Http\Controllers\SuratMasukController::class);
    Route::resource('surat-keluar', App\Http\Controllers\SuratKeluarController::class);

    Route::post('surat-keluar/{suratKeluar}/approve', [App\Http\Controllers\SuratKeluarController::class, 'approve'])->name('surat-keluar.approve');
    Route::post('surat-masuk/{suratMasuk}/disposisi', [App\Http\Controllers\DisposisiController::class, 'store'])->name('surat-masuk.disposisi');

    // Admin Specific
    Route::get('users', [App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    Route::post('users', [App\Http\Controllers\UserController::class, 'store'])->name('users.store');
    Route::patch('users/{user}/status', [App\Http\Controllers\UserController::class, 'updateStatus'])->name('users.status');

    // Reports
    Route::get('reports', [App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [App\Http\Controllers\ReportController::class, 'exportCsv'])->name('reports.export');
});
