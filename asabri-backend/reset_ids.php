<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    echo "Starting Database ID Reset...\n";

    // Disable Foreign Key Checks to allow truncation
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');

    // Truncate tables (Resets ID to 1)
    $tables = ['surat_masuk', 'surat_keluar', 'notifications'];

    foreach ($tables as $table) {
        if (Schema::hasTable($table)) {
            DB::table($table)->truncate();
            echo "✔ Table '$table' truncated (ID reset to 1).\n";
        } else {
            echo "⚠ Table '$table' not found.\n";
        }
    }

    // Re-enable Foreign Key Checks
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

    echo "Database reset completed successfully.\n";

} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    // Ensure FK checks are re-enabled even on error
    try {
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    } catch (\Exception $x) {
    }
}
