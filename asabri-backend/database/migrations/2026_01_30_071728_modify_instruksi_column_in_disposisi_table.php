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
        Schema::table('disposisi', function (Blueprint $table) {
            // Using DB::statement for ENUM modification to ensure compatibility
            \DB::statement("ALTER TABLE disposisi MODIFY COLUMN instruksi ENUM('ACC/Setuju', 'Agar ditindaklanjuti', 'Buat resume', 'Koordinasikan', 'Sebagai Info', 'Laksanakan Sesuai Dengan Ketentuan', 'Lakukan Kajian', 'Menghadap', 'Monitor Perkembangannya', 'Pelajari/Ajukan Saran', 'Selesaikan', 'Simpan', 'Untuk Diketahui', 'Untuk Dilaksanakan', 'Copy') NOT NULL");
        });
    }

    public function down()
    {
        Schema::table('disposisi', function (Blueprint $table) {
            // Revert back to string (or previous state)
            $table->string('instruksi')->change();
        });
    }
};
