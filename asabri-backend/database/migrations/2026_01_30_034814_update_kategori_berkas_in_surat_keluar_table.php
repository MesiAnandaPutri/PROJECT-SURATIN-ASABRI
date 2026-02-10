<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('surat_keluar', function (Blueprint $table) {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN kategori_berkas ENUM(
                'berita acara',
                'memo',
                'mou',
                'nota dinas',
                'pemberitahuan',
                'pengumuman',
                'sppi/pendaftaran keluarga',
                'surat dinas',
                'surat edaran',
                'surat gaji terusan',
                'surat keterangan',
                'surat kuasa',
                'surat perintah',
                'surat perintah perjalanan dinas',
                'surat perjanjian kerja sama',
                'tinjau skep',
                'surat pengantar'
            ) NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('surat_keluar', function (Blueprint $table) {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN kategori_berkas ENUM(
                'berita acara',
                'format',
                'keputusan',
                'memo',
                'mou',
                'nota dinas',
                'pemberitahuan',
                'pengumuman',
                'peraturan',
                'petunjuk pelaksana',
                'rahasia',
                'risalah rapat',
                'sppi/pendaftaran keluarga',
                'surat dinas',
                'surat edaran',
                'surat gaji terusan',
                'surat keterangan',
                'surat kuasa',
                'surat perintah',
                'surat perintah perjalanan dinas',
                'surat perjanjian kerja sama',
                'tinjau skep'
            ) NOT NULL");
        });
    }
};
