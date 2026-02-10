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
            'tanggal_terima_surat' => 'required|date',
            'tanggal_surat_masuk' => 'required|date',
            'perihal' => 'required',
            'status' => 'required|in:proses,selesai,disposisi',
            'klasifikasi' => 'required',
            'tingkat' => 'required',
            'sumber_berkas' => 'required|in:internal,eksternal',
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
