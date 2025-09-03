<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

require_once 'config/cors.php';
require_once 'config/db.php';

// Obtener la ruta de la petición
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Eliminar query string de la URI
$path = parse_url($request_uri, PHP_URL_PATH);

// Router 
if (strpos($path, '/api/auth') === 0) {
    require_once 'routes/auth.php';
} elseif (strpos($path, '/api/products') === 0) {
    require_once 'routes/products.php';
} elseif (strpos($path, '/api/cart') === 0) {
    require_once 'routes/cart.php';
} elseif (strpos($path, '/api/payments') === 0) {
    require_once 'routes/payments.php';
} elseif (strpos($path, '/api/budgets') === 0) {
    require_once 'routes/budgets.php';
} elseif (strpos($path, '/api/test') === 0) {
    require_once __DIR__ . '/routes/testdb.php';
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Endpoint no encontrado"]);
}

?>
