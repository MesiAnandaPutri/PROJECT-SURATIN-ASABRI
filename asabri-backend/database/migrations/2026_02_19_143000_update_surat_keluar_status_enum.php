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
        // Modifying the ENUM column to include 'selesai' and 'proses'
        // Note: We use raw SQL because modifying enums safely with Schema builder is tricky across different DBs,
        // but here we are targeting MySQL specifically as seen in previous migrations.
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN status ENUM('draft', 'proses', 'terkirim', 'selesai') DEFAULT 'draft' NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enums if needed (careful if data exists with new statuses)
        DB::statement("ALTER TABLE surat_keluar MODIFY COLUMN status ENUM('terkirim', 'draft') DEFAULT 'draft' NULL");
    }
};
