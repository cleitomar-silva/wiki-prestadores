<?php

$host = getenv('DB_HOST') ?: 'mysql';
$port = getenv('DB_PORT') ?: '3306';
$database = getenv('DB_DATABASE') ?: 'wiki_relacionamento';
$user = getenv('DB_USERNAME') ?: 'root';
$password = getenv('DB_PASSWORD') ?: 'C2f0z2@6';

new PDO("mysql:host={$host};port={$port};dbname={$database}", $user, $password);
