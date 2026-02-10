<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "Klasifikasi values:\n";
    $klasifikasi = DB::table('surat_masuk')->pluck('klasifikasi')->unique()->toArray();
    print_r($klasifikasi);

    echo "Tingkat values:\n";
    $tingkat = DB::table('surat_masuk')->pluck('tingkat')->unique()->toArray();
    print_r($tingkat);
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
