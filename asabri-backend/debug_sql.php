<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "Updating records...\n";
    DB::table('surat_masuk')->where('klasifikasi', 'terbatas')->update(['klasifikasi' => 'biasa']); // temporarily to biasa
    DB::table('surat_masuk')->where('tingkat', 'rendah')->update(['tingkat' => 'sedang']); // temporarily to sedang

    echo "Altering klasifikasi...\n";
    DB::statement("ALTER TABLE surat_masuk MODIFY COLUMN klasifikasi ENUM('biasa', 'konfidensial', 'rahasia', 'sangat rahasia') NOT NULL DEFAULT 'biasa'");

    echo "Altering tingkat...\n";
    DB::statement("ALTER TABLE surat_masuk MODIFY COLUMN tingkat ENUM('amat segera', 'biasa', 'segera') NOT NULL DEFAULT 'biasa'");

    echo "Success!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
