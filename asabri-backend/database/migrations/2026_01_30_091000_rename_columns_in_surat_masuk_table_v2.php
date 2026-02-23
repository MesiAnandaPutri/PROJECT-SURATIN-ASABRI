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
            if (Schema::hasColumn('surat_masuk', 'asal_surat')) {
                $table->renameColumn('asal_surat', 'pengirim');
            }
            if (Schema::hasColumn('surat_masuk', 'tanggal_surat')) {
                $table->renameColumn('tanggal_surat', 'tanggal_terima_surat');
            }
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
            $table->renameColumn('pengirim', 'asal_surat');
            $table->renameColumn('tanggal_terima_surat', 'tanggal_surat');
        });
    }
};
