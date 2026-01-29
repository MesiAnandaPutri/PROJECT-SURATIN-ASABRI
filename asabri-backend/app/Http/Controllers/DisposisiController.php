<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;

class DisposisiController extends Controller
{
    public function store(Request $request, SuratMasuk $suratMasuk)
    {
        // Only Pimpinan
        if (Auth::user()->role !== 'pimpinan') {
            abort(403);
        }

        $request->validate([
            'diteruskan_kepada' => 'required|array',
            'instruksi' => 'required',
        ]);

        $disposisi = Disposisi::create([
            'surat_masuk_id' => $suratMasuk->id,
            'user_id' => Auth::id(),
            'diteruskan_kepada' => $request->diteruskan_kepada,
            'instruksi' => $request->instruksi,
            'catatan' => $request->catatan,
        ]);

        // Update status surat
        $suratMasuk->update(['status' => 'Disposisi']);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create_disposisi',
            'description' => "Disposisi created for Surat Masuk: {$suratMasuk->nomor_surat}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return back()->with('success', 'Disposisi berhasil dikirim.');
    }
}
