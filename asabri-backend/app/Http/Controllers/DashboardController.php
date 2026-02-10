<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSurat = SuratMasuk::count() + SuratKeluar::count();
        $suratMasuk = SuratMasuk::count();
        $suratKeluar = SuratKeluar::count();
        $pending = SuratMasuk::where('status', 'proses')->count();

        // Get recent activities (last 10 surat masuk and keluar combined)
        $recentMasuk = SuratMasuk::latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal' => $item->tanggal_surat_masuk,
                    'waktu' => $item->created_at->format('H:i'),
                    'tipe' => 'Surat Masuk',
                    'dari_kepada' => $item->pengirim,
                    'perihal' => $item->perihal,
                    'status' => $item->status ?? 'proses'
                ];
            });

        $recentKeluar = SuratKeluar::latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal' => $item->tanggal_pembuatan,
                    'waktu' => $item->created_at->format('H:i'),
                    'tipe' => 'Surat Keluar',
                    'dari_kepada' => $item->tujuan,
                    'perihal' => $item->perihal,
                    'status' => 'terkirim'
                ];
            });

        $activities = $recentMasuk->concat($recentKeluar)
            ->sortByDesc('tanggal')
            ->take(10)
            ->values();

        return response()->json([
            'stats' => [
                'total' => (string) $totalSurat,
                'masuk' => (string) $suratMasuk,
                'keluar' => (string) $suratKeluar,
                'pending' => (string) $pending,
            ],
            'activities' => $activities
        ]);
    }
}
