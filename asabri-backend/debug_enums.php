<?php

use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$columns = ['kategori_berkas', 'klasifikasi_surat_dinas', 'tingkat_urgensi_penyelesaian'];

echo "Checking surat_keluar columns:\n";
foreach ($columns as $col) {
    $result = DB::select("SHOW COLUMNS FROM surat_keluar WHERE Field = '$col'");
    if (!empty($result)) {
        echo "Column: $col\n";
        echo "Type: " . $result[0]->Type . "\n";
    } else {
        echo "Column: $col -> NOT FOUND\n";
    }
    echo "-------------------\n";
}
