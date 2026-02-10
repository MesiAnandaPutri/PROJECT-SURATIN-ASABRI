<?php
$host = '192.168.0.111';
$port = '3307';
$db = 'asabri_suratin';
$user = 'root';
$pass = 'SandiMySQL24';

echo "Attempting to connect to mysql:host=$host;port=$port;dbname=$db...\n";

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "SUCCESS: Connected to database '$db' on $host:$port!\n";
} catch (PDOException $e) {
    echo "ERROR: Could not connect to database.\n";
    echo "Message: " . $e->getMessage() . "\n";
}
