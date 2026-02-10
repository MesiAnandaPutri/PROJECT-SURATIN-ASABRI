<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;

class DummyDataSeeder extends Seeder
{
    public function run()
    {
        SuratMasuk::create([
            'pengirim' => 'Kementerian Pertahanan',
            'dari_tanggal' => '2026-01-28',
            'sampai_tanggal' => '2026-01-29',
            'perihal' => 'Undangan Rapat Koordinasi',
            'no_surat' => 'SRT/001/I/2026',
            'status' => 'proses',
            'klasifikasi' => 'biasa',
            'tingkat' => 'tinggi',
            'sumber_berkas' => 'surat dinas'
        ]);

        SuratMasuk::create([
            'pengirim' => 'Mabes TNI AD',
            'dari_tanggal' => '2026-01-25',
            'sampai_tanggal' => '2026-01-26',
            'perihal' => 'Laporan Audit',
            'no_surat' => 'SRT/002/I/2026',
            'status' => 'selesai',
            'klasifikasi' => 'rahasia',
            'tingkat' => 'sedang',
            'sumber_berkas' => 'nota dinas'
        ]);

        SuratKeluar::create([
            'sumber_berkas' => 'internal',
            'kirim_sebagai' => 'Direktur Utama',
            'tanggal_pembuatan' => '2026-01-28',
            'kategori_berkas' => 'surat dinas',
            'tujuan' => 'Kementerian Pertahanan',
            'no_surat' => 'KEL/001/I/2026',
            'status' => 'terkirim',
            'perihal' => 'Balasan Undangan',
            'tingkat_urgensi_penyelesaian' => 'tinggi',
            'klasifikasi_surat_dinas' => 'biasa'
        ]);
    }
}
