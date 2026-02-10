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
        // Map existing values to new enums to avoid constraint violations
        \Illuminate\Support\Facades\DB::table('surat_masuk')->where('klasifikasi', 'terbatas')->update(['klasifikasi' => 'konfidensial']);
        \Illuminate\Support\Facades\DB::table('surat_masuk')->where('tingkat', 'rendah')->update(['tingkat' => 'biasa']);
        \Illuminate\Support\Facades\DB::table('surat_masuk')->where('tingkat', 'sedang')->update(['tingkat' => 'biasa']);
        \Illuminate\Support\Facades\DB::table('surat_masuk')->where('tingkat', 'tinggi')->update(['tingkat' => 'segera']);

        \Illuminate\Support\Facades\DB::statement("ALTER TABLE surat_masuk MODIFY COLUMN klasifikasi ENUM('biasa', 'konfidensial', 'rahasia', 'sangat rahasia') NOT NULL DEFAULT 'biasa'");
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE surat_masuk MODIFY COLUMN tingkat ENUM('amat segera', 'biasa', 'segera') NOT NULL DEFAULT 'biasa'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE surat_masuk MODIFY COLUMN klasifikasi ENUM('biasa', 'terbatas', 'rahasia', 'sangat rahasia') NOT NULL DEFAULT 'biasa'");
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE surat_masuk MODIFY COLUMN tingkat ENUM('tinggi', 'sedang', 'rendah') NOT NULL DEFAULT 'sedang'");
    }
};
