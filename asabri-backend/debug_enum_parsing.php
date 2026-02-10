<?php

use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$columns = ['kategori_berkas', 'klasifikasi_surat_dinas', 'tingkat_urgensi_penyelesaian'];

echo "DEBUGGING ENUM PARSING:\n";
$output = "DEBUGGING ENUM PARSING:\n";

foreach ($columns as $column) {
    echo "Column: $column\n";
    $output .= "Column: $column\n";
    $result = DB::select("SHOW COLUMNS FROM surat_keluar WHERE Field = '$column'");
    if (empty($result)) {
        echo "  -> NOT FOUND\n";
        $output .= "  -> NOT FOUND\n";
        continue;
    }

    $type = $result[0]->Type;
    echo "  -> Raw Type: " . $type . "\n";
    $output .= "  -> Raw Type: " . $type . "\n";

    preg_match("/^enum\((.*)\)$/i", $type, $matches);

    if (isset($matches[1])) {
        echo "  -> Regex Match: Yes\n";
        $output .= "  -> Regex Match: Yes\n";
        echo "  -> Content: " . $matches[1] . "\n";
        $output .= "  -> Content: " . $matches[1] . "\n";

        $enum = array_map(function ($value) {
            return trim($value, "'");
        }, explode(',', $matches[1]));

        echo "  -> Parsed Values: " . implode(', ', $enum) . "\n";
        $output .= "  -> Parsed Values: " . implode(', ', $enum) . "\n";
    } else {
        $output .= "  -> Regex Match: NO\n";
    }
    $output .= "------------------------------------------------\n";
}
file_put_contents('debug_output.txt', $output);
echo "Debug finished. Output written to debug_output.txt";
