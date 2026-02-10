<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Modify surat_masuk columns to be nullable
        // Note: IF these already ran, running them again with MODIFY is generally safe in MySQL
        DB::statement("ALTER TABLE surat_masuk MODIFY pengirim VARCHAR(255) NULL");
        DB::statement("ALTER TABLE surat_masuk MODIFY tanggal_terima_surat DATE NULL");
        DB::statement("ALTER TABLE surat_masuk MODIFY tanggal_surat_masuk DATE NULL");
        DB::statement("ALTER TABLE surat_masuk MODIFY perihal TEXT NULL");
        DB::statement("ALTER TABLE surat_masuk MODIFY sumber_berkas VARCHAR(255) NULL");

        // Modify surat_keluar columns to be nullable
        DB::statement("ALTER TABLE surat_keluar MODIFY tujuan VARCHAR(255) NULL");
        DB::statement("ALTER TABLE surat_keluar MODIFY tanggal_pembuatan DATE NULL");
        DB::statement("ALTER TABLE surat_keluar MODIFY perihal TEXT NULL");

        // Handle Enums. CAUTION: MODIFY ENUM requires listing all values. 
        // We use the exact list from previous migration or known values.

        // Kategori Berkas
        DB::statement("ALTER TABLE surat_keluar MODIFY kategori_berkas ENUM(
            'berita acara', 'format', 'keputusan', 'memo', 'mou', 'nota dinas', 'pemberitahuan', 'pengumuman',
            'peraturan', 'petunjuk pelaksana', 'rahasia', 'risalah rapat', 'sppi/pendaftaran keluarga',
            'surat dinas', 'surat edaran', 'surat gaji terusan', 'surat keterangan', 'surat kuasa',
            'surat perintah', 'surat perintah perjalanan dinas', 'surat perjanjian kerja sama', 'tinjau skep'
        ) NULL");

        // Klasifikasi
        DB::statement("ALTER TABLE surat_keluar MODIFY klasifikasi_surat_dinas ENUM(
            'biasa', 'konfidensial', 'rahasia', 'sangat rahasia'
        ) NULL DEFAULT 'biasa'");

        // Tingkat Urgensi
        DB::statement("ALTER TABLE surat_keluar MODIFY tingkat_urgensi_penyelesaian ENUM(
            'biasa', 'amat segera', 'segera'
        ) NULL DEFAULT 'biasa'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
