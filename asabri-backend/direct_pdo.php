<?php
$host = '127.0.0.1';
$db = 'asabri_suratin';
$user = 'root';
$pass = 'SandiMySQL24';
$port = '3307';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;port=$port;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Connected to MySQL!\n";

    echo "Converting to VARCHAR temporarily...\n";
    $pdo->exec("ALTER TABLE surat_masuk MODIFY COLUMN klasifikasi VARCHAR(255) NOT NULL DEFAULT 'biasa'");
    $pdo->exec("ALTER TABLE surat_masuk MODIFY COLUMN tingkat VARCHAR(255) NOT NULL DEFAULT 'biasa'");

    echo "Mapping values...\n";
    // Map Klasifikasi
    $pdo->exec("UPDATE surat_masuk SET klasifikasi = 'biasa' WHERE klasifikasi NOT IN ('biasa', 'konfidensial', 'rahasia', 'sangat rahasia')");
    $pdo->exec("UPDATE surat_masuk SET klasifikasi = 'konfidensial' WHERE klasifikasi = 'terbatas'");

    // Map Tingkat
    $pdo->exec("UPDATE surat_masuk SET tingkat = 'biasa' WHERE tingkat NOT IN ('amat segera', 'biasa', 'segera')");
    $pdo->exec("UPDATE surat_masuk SET tingkat = 'biasa' WHERE tingkat IN ('sedang', 'rendah')");
    $pdo->exec("UPDATE surat_masuk SET tingkat = 'segera' WHERE tingkat = 'tinggi'");

    echo "Converting to NEW ENUM...\n";
    $pdo->exec("ALTER TABLE surat_masuk MODIFY COLUMN klasifikasi ENUM('biasa', 'konfidensial', 'rahasia', 'sangat rahasia') NOT NULL DEFAULT 'biasa'");
    $pdo->exec("ALTER TABLE surat_masuk MODIFY COLUMN tingkat ENUM('amat segera', 'biasa', 'segera') NOT NULL DEFAULT 'biasa'");

    echo "Success!\n";
} catch (\PDOException $e) {
    echo "PDO Error: " . $e->getMessage() . "\n";
}
