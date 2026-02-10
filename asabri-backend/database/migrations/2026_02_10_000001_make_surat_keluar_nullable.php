<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::table('surat_keluar', function (Blueprint $table) {
            $table->string('tujuan')->nullable()->change();
            $table->string('no_surat')->nullable()->change();
            $table->text('perihal')->nullable()->change();
            $table->date('tanggal_pembuatan')->nullable()->change();
            $table->string('sumber_berkas')->nullable()->change();
        });

        // Modify ENUM columns to allow NULL using raw SQL
        // We use the exact values from the original migration

        // Status: default 'draft'
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN status ENUM('terkirim', 'draft') DEFAULT 'draft' NULL");

        // Tingkat Urgensi: default 'sedang'
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('tinggi', 'sedang', 'rendah') DEFAULT 'sedang' NULL");

        // Klasifikasi: default 'biasa'
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN klasifikasi_surat_dinas ENUM('biasa', 'terbatas', 'rahasia', 'sangat rahasia') DEFAULT 'biasa' NULL");

        // Kategori Berkas
        $kategori = "'berita acara','format','keputusan','memo','mou','nota dinas','pemberitahuan','pengumuman','peraturan','petunjuk pelaksana','rahasia','risalah rapat','sppi/pendaftaran keluarga','surat dinas','surat edaran','surat gaji terusan','surat keterangan','surat kuasa','surat perintah','surat perintah perjalanan dinas','surat perjanjian kerja sama','tinjau skep'";
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN kategori_berkas ENUM($kategori) NULL");
    }

    public function down()
    {
        // Reverting to NOT NULL implies potentially invalid data if NULLs were inserted.
        // We can attempt to revert, but usually making column nullable is a one-way safe operation.
        // For 'down', we can try to set them back to NOT NULL, assuming no nulls exist.

        Schema::table('surat_keluar', function (Blueprint $table) {
            // $table->string('tujuan')->nullable(false)->change(); 
            // We leave this empty to prevent data loss on rollback
        });
    }
};
