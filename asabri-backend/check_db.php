<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = ['surat_masuk', 'surat_keluar'];
foreach ($tables as $t) {
    echo "TABLE: $t" . PHP_EOL;
    $cols = \Illuminate\Support\Facades\DB::select("DESCRIBE $t");
    foreach ($cols as $c) {
        $f = $c->Field;
        // Filter relevant columns
        if (
            in_array($f, [
                'pengirim',
                'no_surat',
                'tanggal_terima_surat',
                'tanggal_surat_masuk',
                'perihal',
                'sumber_berkas', // Masuk
                'tujuan',
                'tanggal_pembuatan',
                'kategori_berkas',
                'tingkat_urgensi_penyelesaian',
                'klasifikasi_surat_dinas' // Keluar
            ])
        ) {
            echo "$f | $c->Type | Nullable: $c->Null" . PHP_EOL;
        }
    }
    echo PHP_EOL;
}
