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
            $table->renameColumn('sumber_berkas', 'kategori_berkas');
        });

        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->enum('sumber_berkas', ['internal', 'eksternal'])->default('internal')->after('tingkat');
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
            $table->dropColumn('sumber_berkas');
        });

        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->renameColumn('kategori_berkas', 'sumber_berkas');
        });
    }
};
