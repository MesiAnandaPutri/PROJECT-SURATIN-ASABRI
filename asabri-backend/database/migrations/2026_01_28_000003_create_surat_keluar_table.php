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
        Schema::create('surat_keluar', function (Blueprint $table) {
            $table->id();
            $table->enum('sumber_berkas', ['internal', 'eksternal']);
            $table->string('kirim_sebagai')->nullable();
            $table->date('tanggal_pembuatan');
            $table->enum('kategori_berkas', [
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
            $table->string('no_surat')->unique();
            $table->enum('status', ['terkirim', 'draft'])->default('draft');
            $table->text('perihal');
            $table->enum('tingkat_urgensi_penyelesaian', ['tinggi', 'sedang', 'rendah'])->default('sedang');
            $table->enum('klasifikasi_surat_dinas', ['biasa', 'terbatas', 'rahasia', 'sangat rahasia'])->default('biasa');
            $table->text('keterangan')->nullable();
            $table->string('dokumen')->nullable();
            $table->string('nama_lampiran')->nullable();
            $table->string('lampiran')->nullable();
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
        Schema::dropIfExists('surat_keluar');
    }
};
