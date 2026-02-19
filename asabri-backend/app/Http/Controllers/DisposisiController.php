<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;

class DisposisiController extends Controller
{
    public function store(Request $request, $id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        // Strict: Only 'pimpinan' can create dispositions
        if (Auth::user()->role !== 'pimpinan') {
            abort(403, 'Unauthorized. Only Pimpinan can create dispositions.');
        }

        try {
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
                'description' => "Disposisi created for Surat Masuk: {$suratMasuk->no_surat}",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Create Notifications for Recipients
            $recipients = $request->diteruskan_kepada; // Array of names
            if (!empty($recipients)) {
                // Find users by nama_lengkap
                $users = \App\Models\User::whereIn('nama_lengkap', $recipients)->get();

                foreach ($users as $recipientUser) {
                    \App\Models\Notification::create([
                        'user_id' => $recipientUser->id,
                        'title' => 'Disposisi Baru',
                        'message' => "Anda menerima disposisi baru pada surat No: {$suratMasuk->no_surat}",
                        'surat_masuk_id' => $suratMasuk->id,
                        'is_read' => false,
                    ]);
                }
            }

            return response()->json(['message' => 'Disposisi berhasil dikirim.'], 200);
        } catch (\Exception $e) {
            \Log::error('Disposisi Error: ' . $e->getMessage());
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }
    public function download($id)
    {
        $suratMasuk = SuratMasuk::with(['disposisi'])->findOrFail($id);
        $disposisi = $suratMasuk->disposisi->last(); // Get latest disposisi

        return $this->generateDisposisiPdf($suratMasuk, $disposisi);
    }

    public function downloadSingle($disposisiId)
    {
        $disposisi = Disposisi::with('suratMasuk')->findOrFail($disposisiId);
        $suratMasuk = $disposisi->suratMasuk;

        return $this->generateDisposisiPdf($suratMasuk, $disposisi);
    }

    private function generateDisposisiPdf($suratMasuk, $disposisi)
    {
        $pimpinanUser = null;
        if ($disposisi) {
            $pimpinanUser = \App\Models\User::find($disposisi->user_id);
        }

        $ttdPath = ($pimpinanUser && $pimpinanUser->ttd_path) ? public_path('storage/' . $pimpinanUser->ttd_path) : null;

        $data = [
            'surat' => $suratMasuk,
            'disposisi' => $disposisi,
            'pimpinan_name' => $pimpinanUser ? $pimpinanUser->nama_lengkap : 'KAKANCAB',
            'ttd_path' => $ttdPath,
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.disposisi', $data);
        $pdf->setPaper([0, 0, 609.4488, 935.433], 'portrait');

        return $pdf->stream('Lembar_Disposisi_' . str_replace('/', '_', $suratMasuk->no_surat) . '.pdf');
    }
}
