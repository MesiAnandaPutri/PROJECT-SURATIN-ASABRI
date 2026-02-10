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
        // 1. Data Mapping to avoid constraint violations
        DB::table('surat_keluar')->where('klasifikasi_surat_dinas', 'terbatas')->update(['klasifikasi_surat_dinas' => 'rahasia']); // Safe temporary mapping if konfidensial doesn't exist yet

        // Actually, let's just use ALTER TABLE directly as it handles the transition better if we define all values first

        // Update Klasifikasi
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN klasifikasi_surat_dinas ENUM('biasa', 'konfidensial', 'rahasia', 'sangat rahasia') NOT NULL DEFAULT 'biasa'");



        // Map data first
        DB::table('surat_keluar')->where('tingkat_urgensi_penyelesaian', 'rendah')->update(['tingkat_urgensi_penyelesaian' => 'sedang']); // Map to a value that exists for now

        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('amat segera', 'biasa', 'segera', 'tinggi', 'sedang', 'rendah') NOT NULL DEFAULT 'biasa'");

        DB::table('surat_keluar')->where('tingkat_urgensi_penyelesaian', 'tinggi')->update(['tingkat_urgensi_penyelesaian' => 'segera']);
        DB::table('surat_keluar')->where('tingkat_urgensi_penyelesaian', 'sedang')->update(['tingkat_urgensi_penyelesaian' => 'biasa']);
        DB::table('surat_keluar')->where('tingkat_urgensi_penyelesaian', 'rendah')->update(['tingkat_urgensi_penyelesaian' => 'biasa']);

        // Final cleanup of enums
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('amat segera', 'biasa', 'segera') NOT NULL DEFAULT 'biasa'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('surat_keluar', function (Blueprint $table) {
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN klasifikasi_surat_dinas ENUM('biasa', 'terbatas', 'rahasia', 'sangat rahasia') NOT NULL DEFAULT 'biasa'");
            DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('tinggi', 'sedang', 'rendah') NOT NULL DEFAULT 'sedang'");
        });
    }
};
