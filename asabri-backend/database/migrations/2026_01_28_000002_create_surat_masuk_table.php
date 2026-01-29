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
        Schema::create('surat_masuk', function (Blueprint $table) {
            $table->id();
            $table->string('pengirim');
            $table->date('dari_tanggal');
            $table->date('sampai_tanggal');
            $table->text('perihal');
            $table->string('no_surat')->unique();
            $table->enum('status', ['proses', 'selesai', 'disposisi'])->default('proses');
            $table->enum('klasifikasi', ['biasa', 'terbatas', 'rahasia', 'sangat rahasia'])->default('biasa');
            $table->enum('tingkat', ['tinggi', 'sedang', 'rendah'])->default('sedang');
            $table->enum('sumber_berkas', [
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
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('surat_masuk');
    }
};
