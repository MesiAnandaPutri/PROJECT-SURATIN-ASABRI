<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_surat' => SuratMasuk::count() + SuratKeluar::count(),
            'surat_masuk' => SuratMasuk::count(),
            'surat_keluar' => SuratKeluar::count(),
            'pending' => SuratMasuk::where('status', 'proses')->count(),
        ];

        return view('dashboard', compact('stats'));
    }
}
