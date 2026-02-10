<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update klasifikasi_surat_dinas enum
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN klasifikasi_surat_dinas ENUM('biasa', 'konfidensial', 'rahasia', 'sangat rahasia') DEFAULT 'biasa'");

        // Update tingkat_urgensi_penyelesaian enum - keeping superset as discussed, or should I restrict?
        // User didn't restrict urgency, so I'll keep the expansion to be safe.
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('tinggi', 'sedang', 'rendah', 'amat segera', 'biasa', 'segera') DEFAULT 'biasa'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enums
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN klasifikasi_surat_dinas ENUM('biasa', 'terbatas', 'rahasia', 'sangat rahasia') DEFAULT 'biasa'");
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN tingkat_urgensi_penyelesaian ENUM('tinggi', 'sedang', 'rendah') DEFAULT 'sedang'");
    }
};
