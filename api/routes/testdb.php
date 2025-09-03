<?php
require_once(__DIR__ . "/../config/db.php");

try {
    $stmt = $pdo->query("SELECT NOW() as fecha");
    $row = $stmt->fetch();
    echo json_encode([
        "success" => true,
        "message" => "Conexión exitosa a la DB",
        "fecha" => $row["fecha"]
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al ejecutar test",
        "error" => $e->getMessage()
    ]);
}
