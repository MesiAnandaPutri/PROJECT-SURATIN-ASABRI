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
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->dropColumn(['klasifikasi', 'tingkat']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->enum('klasifikasi', ['biasa', 'konfidensial', 'rahasia', 'sangat rahasia'])->default('biasa');
            $table->enum('tingkat', ['amat segera', 'biasa', 'segera'])->default('biasa');
        });
    }
};
