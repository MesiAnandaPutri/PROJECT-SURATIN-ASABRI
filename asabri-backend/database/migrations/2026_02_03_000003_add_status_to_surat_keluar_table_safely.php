<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        if (!Schema::hasColumn('surat_keluar', 'status')) {
            Schema::table('surat_keluar', function (Blueprint $table) {
                $table->enum('status', ['terkirim', 'draft'])->default('draft')->after('no_surat');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('surat_keluar', 'status')) {
            Schema::table('surat_keluar', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
