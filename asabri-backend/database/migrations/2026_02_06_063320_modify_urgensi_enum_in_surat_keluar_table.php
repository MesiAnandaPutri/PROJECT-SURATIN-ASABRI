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
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('amat segera', 'biasa', 'segera') NOT NULL");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('tinggi', 'sedang', 'rendah', 'amat segera', 'biasa', 'segera') NOT NULL");
    }
};
