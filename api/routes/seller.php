<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Seller.php';

$sellerModel = new Seller($pdo);
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// LISTAR (solo activos por defecto)
if ($method === 'GET' && $path === '/api/sellers') {
    $onlyActive = !isset($_GET['all']); 
    $sellers = $sellerModel->getAll($onlyActive);
    echo json_encode(["success" => true, "data" => $sellers]);
}

// CREAR
elseif ($method === 'POST' && $path === '/api/sellers') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['nombre']) || empty($data['apellido']) || empty($data['numeroVendedor'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
        exit;
    }

    try {
        $id = $sellerModel->create($data);
        echo json_encode(["success" => true, "data" => ["id" => $id]]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { 
            http_response_code(409);
            echo json_encode(["success" => false, "message" => "El número de vendedor ya existe"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    }
}

// DESACTIVAR
elseif ($method === 'PATCH' && preg_match('#^/api/sellers/(\d+)/deactivate$#', $path, $matches)) {
    $id = $matches[1];
    $success = $sellerModel->deactivate($id);
    echo json_encode(["success" => $success]);
}

// ACTIVAR
elseif ($method === 'PATCH' && preg_match('#^/api/sellers/(\d+)/activate$#', $path, $matches)) {
    $id = $matches[1];
    $success = $sellerModel->activate($id);
    echo json_encode(["success" => $success]);
}
