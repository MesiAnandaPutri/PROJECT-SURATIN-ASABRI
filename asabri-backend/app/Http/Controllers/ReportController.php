<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Admin and Pimpinan can see reports
        if (in_array(Auth::user()->role, ['staff']))
            abort(403);

        $type = $request->get('type', 'masuk');
        $query = ($type === 'masuk') ? SuratMasuk::query() : SuratKeluar::query();

        // Date filter based on schema fields
        if ($request->filled('start_date')) {
            $dateField = ($type === 'masuk') ? 'dari_tanggal' : 'tanggal_pembuatan';
            $query->where($dateField, '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $dateField = ($type === 'masuk') ? 'dari_tanggal' : 'tanggal_pembuatan';
            $query->where($dateField, '<=', $request->end_date);
        }

        $reports = $query->latest()->get();
        return view('reports.index', compact('reports', 'type'));
    }

    public function exportCsv(Request $request)
    {
        $type = $request->get('type', 'masuk');
        $query = ($type === 'masuk') ? SuratMasuk::query() : SuratKeluar::query();
        $data = $query->get();

        $filename = "laporan_surat_{$type}_" . date('Ymd') . ".csv";
        $handle = fopen('php://output', 'w');

        header('Content-Type: text/csv');
        header("Content-Disposition: attachment; filename=\"$filename\"");

        fputcsv($handle, ['No', 'Nomor Surat', 'Tanggal', 'Perihal', 'Status']);

        foreach ($data as $index => $row) {
            fputcsv($handle, [
                $index + 1,
                $row->no_surat,
                ($type === 'masuk') ? $row->dari_tanggal : $row->tanggal_pembuatan,
                $row->perihal,
                $row->status
            ]);
        }

        fclose($handle);
        exit;
    }
}
