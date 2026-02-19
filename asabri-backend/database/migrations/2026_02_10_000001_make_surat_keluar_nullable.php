<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        // Using raw SQL to avoid doctrine/dbal dependency issues

        // Make columns nullable using raw SQL
        // 'sumber_berkas' is removed because it does not exist in the table

        // We check if columns exist before modifying them to be safe, although in a migration we usually assume schema state.
        // But here we just run the ALTER statements directly.

        try {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tujuan VARCHAR(255) NULL");
        } catch (\Exception $e) {
        }

        try {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN no_surat VARCHAR(255) NULL");
        } catch (\Exception $e) {
        }

        try {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN perihal TEXT NULL");
        } catch (\Exception $e) {
        }

        try {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tanggal_pembuatan DATE NULL");
        } catch (\Exception $e) {
        }

        // Modify ENUM columns to allow NULL

        // Status: default 'draft'
        try {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN status ENUM('terkirim', 'draft') DEFAULT 'draft' NULL");
        } catch (\Exception $e) {
        }

        // Tingkat Urgensi: default 'sedang'
        try {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('tinggi', 'sedang', 'rendah') DEFAULT 'sedang' NULL");
        } catch (\Exception $e) {
        }

        // Klasifikasi: default 'biasa'
        try {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN klasifikasi_surat_dinas ENUM('biasa', 'terbatas', 'rahasia', 'sangat rahasia') DEFAULT 'biasa' NULL");
        } catch (\Exception $e) {
        }

        // Kategori Berkas
        try {
            $kategori = "'berita acara','format','keputusan','memo','mou','nota dinas','pemberitahuan','pengumuman','peraturan','petunjuk pelaksana','rahasia','risalah rapat','sppi/pendaftaran keluarga','surat dinas','surat edaran','surat gaji terusan','surat keterangan','surat kuasa','surat perintah','surat perintah perjalanan dinas','surat perjanjian kerja sama','tinjau skep'";
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN kategori_berkas ENUM($kategori) NULL");
        } catch (\Exception $e) {
        }
    }

    public function down()
    {
        // Reverting not implemented to avoid data loss issues if NULLs exist
    }
};