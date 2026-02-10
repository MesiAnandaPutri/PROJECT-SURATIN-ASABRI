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
            $table->renameColumn('dari_tanggal', 'tanggal_surat');
            $table->renameColumn('sampai_tanggal', 'tanggal_surat_masuk');
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
            $table->renameColumn('tanggal_surat', 'dari_tanggal');
            $table->renameColumn('tanggal_surat_masuk', 'sampai_tanggal');
        });
    }
};
