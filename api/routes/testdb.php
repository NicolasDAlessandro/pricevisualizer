<?php
require_once __DIR__ . '/../config/db.php';

$stmt = $pdo->prepare("INSERT INTO payments (user_id, amount, method, installments, description, status, created_at, updated_at)
                       VALUES (1, 99.99, 'test', 1, 'Pago de prueba', 1, NOW(), NOW())");
$stmt->execute();

echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
