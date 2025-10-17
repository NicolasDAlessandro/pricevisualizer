<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Payments.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

$paymentModel = new Payment($pdo);
$method = $_SERVER['REQUEST_METHOD'];
$path   = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), "/"); 

try {
    // CREAR PAGO
    if ($method === "POST" && $path === "/api/payments") {
        $user = verifyAuth($pdo);

        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Solo el admin puede registrar pagos"]);
            exit;
        }

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input['method']) || trim($input['method']) === "") {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "El campo 'method' es obligatorio"]);
            exit;
        }

        if (!isset($input['amount']) || !is_numeric($input['amount']) || $input['amount'] < 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "El campo 'amount' debe ser un número válido"]);
            exit;
        }

        $input['user_id'] = $user['id'];
        $input['installments'] = $input['installments'] ?? 1;
        $input['description'] = !empty($input['description']) ? $input['description'] : null;

        $payment = $paymentModel->create($input);

        echo json_encode(["success" => true, "data" => $payment]);
        exit;
    }

    // LISTAR PAGOS
    if ($method === "GET" && $path === "/api/payments") {
        $user = verifyAuth($pdo);
        $payments = $paymentModel->getAll();
        echo json_encode(["success" => true, "data" => $payments]);
        exit;
    }

    // ACTUALIZAR
    if ($method === "PUT" && preg_match('#^/api/payments/(\d+)$#', $path, $matches)) {
        $user = verifyAuth($pdo);

        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "No tienes permiso para actualizar pagos"]);
            exit;
        }

        $id = (int) $matches[1];
        $input = json_decode(file_get_contents("php://input"), true);

        if (empty($input)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No se enviaron datos para actualizar"]);
            exit;
        }

        $paymentModel->update($id, $input);
        echo json_encode(["success" => true, "message" => "Pago actualizado correctamente"]);
        exit;
    }

    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Ruta no encontrada"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error interno: " . $e->getMessage()]);
}
