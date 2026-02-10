<?php

namespace App\Http\Controllers;

use App\Models\SuratKeluar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;
use App\Imports\SuratKeluarImport;
use Maatwebsite\Excel\Facades\Excel;

class SuratKeluarController extends Controller
{
    public function index()
    {
        $suratKeluar = SuratKeluar::latest()->paginate(10);
        return view('surat-keluar.index', compact('suratKeluar'));
    }

    public function store(Request $request)
    {
        if (!in_array(Auth::user()->role, ['admin', 'staff'])) {
            abort(403);
        }

        $request->validate([
            'sumber_berkas' => 'required|in:internal,eksternal',
            'kirim_sebagai' => 'required',
            'tanggal_pembuatan' => 'required|date',
            'kategori_berkas' => 'required|in:nota dinas,surat perintah,surat edaran,peraturan,keputusan',
            'no_surat' => 'required|unique:surat_keluar',
            'status' => 'required|in:draft,proses,terkirim',
            'perihal' => 'required',
            'tingkat_urgensi_penyelesaian' => 'required|in:rendah,sedang,tinggi,mendesak',
            'klasifikasi_surat_dinas' => 'required|in:biasa,terbatas,rahasia,sangat rahasia',
        ]);

        $surat = SuratKeluar::create($request->all());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create_surat_keluar',
            'description' => "Created Surat Keluar: {$surat->no_surat}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return redirect()->route('surat-keluar.index');
    }

    public function approve(Request $request, SuratKeluar $suratKeluar)
    {
        if (Auth::user()->role !== 'pimpinan') {
            abort(403);
        }

        $suratKeluar->update(['status' => 'terkirim']);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'approve_surat_keluar',
            'description' => "Approved Surat Keluar: {$suratKeluar->no_surat}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return back()->with('success', 'Surat disetujui.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new SuratKeluarImport, $request->file('file'));

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'import_surat_keluar',
            'description' => "Imported Surat Keluar from Excel",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return back()->with('success', 'Data berhasil diimport.');
    }
}
