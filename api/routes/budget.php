<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Budget.php';
require_once __DIR__ . '/../middleware/auth.php';

$budgetModel = new Budget($pdo);
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// LISTAR PRESUPUESTOS
if ($method === 'GET' && $path === '/api/budgets') {
    $user = verifyAuth($pdo);
    $filters = $_GET;
    $budgets = $budgetModel->getAll($filters);
    echo json_encode(["success" => true, "data" => $budgets]);
}

// CREAR
elseif ($method === 'POST' && $path === '/api/budgets') {
    $user = verifyAuth($pdo);
    $data = json_decode(file_get_contents('php://input'), true);
    $data['userId'] = $user['id'];
    $id = $budgetModel->create($data);
    echo json_encode(["success" => true, "data" => ["id" => $id]]);
}

// DETALLE
elseif ($method === 'GET' && preg_match('#^/api/budgets/(\d+)$#', $path, $m)) {
    $budget = $budgetModel->getById($m[1]);
    echo $budget ? json_encode(["success" => true, "data" => $budget])
                 : json_encode(["success" => false, "message" => "Not found"]);
}

// UPDATE
elseif ($method === 'PUT' && preg_match('#^/api/budgets/(\d+)$#', $path, $m)) {
    $data = json_decode(file_get_contents('php://input'), true);
    $budgetModel->update($m[1], $data);
    echo json_encode(["success" => true, "data" => ["message" => "Updated"]]);
}

// DELETE
elseif ($method === 'DELETE' && preg_match('#^/api/budgets/(\d+)$#', $path, $m)) {
    $budgetModel->delete($m[1]);
    echo json_encode(["success" => true, "data" => ["message" => "Deleted"]]);
}

else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Endpoint no encontrado"]);
}
