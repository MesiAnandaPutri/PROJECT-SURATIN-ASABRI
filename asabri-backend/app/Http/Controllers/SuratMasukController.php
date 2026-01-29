<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;

class SuratMasukController extends Controller
{
    public function index(Request $request)
    {
        $query = SuratMasuk::query();

        if ($request->has('search')) {
            $query->where('perihal', 'like', '%' . $request->search . '%')
                ->orWhere('no_surat', 'like', '%' . $request->search . '%');
        }

        $suratMasuk = $query->latest()->paginate(10);
        return view('surat-masuk.index', compact('suratMasuk'));
    }

    public function create()
    {
        if (!in_array(Auth::user()->role, ['admin', 'staff'])) {
            abort(403);
        }
        return view('surat-masuk.create');
    }

    public function store(Request $request)
    {
        if (!in_array(Auth::user()->role, ['admin', 'staff'])) {
            abort(403);
        }

        $request->validate([
            'pengirim' => 'required',
            'no_surat' => 'required|unique:surat_masuk',
            'dari_tanggal' => 'required|date',
            'sampai_tanggal' => 'required|date',
            'perihal' => 'required',
            'status' => 'required|in:proses,selesai',
            'klasifikasi' => 'required|in:biasa,penting,rahasia,segera',
            'tingkat' => 'required|in:rendah,sedang,tinggi,mendesak',
            'sumber_berkas' => 'required|in:nota dinas,surat edaran,surat masuk,peraturan',
        ]);

        $surat = SuratMasuk::create($request->all());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create_surat_masuk',
            'description' => "Created Surat Masuk: {$surat->no_surat}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return redirect()->route('surat-masuk.index')->with('success', 'Surat Masuk berhasil ditambahkan.');
    }

    public function show(SuratMasuk $suratMasuk)
    {
        return view('surat-masuk.show', compact('suratMasuk'));
    }
}
