<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/cors.php";

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$basePath = "/api/payments";
$subPath = substr($path, strlen($basePath));
 
try {
    if ($method === "POST" && $subPath === "") {
        // Crear pago
        $input = json_decode(file_get_contents("php://input"), true);

        $amount       = $input["amount"] ?? 0;
        $methodPay    = $input["method"] ?? "";
        $installments = $input["installments"] ?? 1;
        $description  = $input["description"] ?? "";
        $userId       = $input["user_id"] ?? 1; 
        $status       = "pending";

        if ($amount <= 0 || empty($methodPay)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Faltan datos obligatorios"]);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO payments (user_id, amount, method, installments, description, status, created_at, updated_at)
            VALUES (:user_id, :amount, :method, :installments, :description, :status, NOW(), NOW())
        ");
        $stmt->execute([
            ":user_id"      => $userId,
            ":amount"       => $amount,
            ":method"       => $methodPay,
            ":installments" => $installments,
            ":description"  => $description,
            ":status"       => $status
        ]);

        echo json_encode([
            "success"    => true,
            "message"    => "Pago creado correctamente",
            "payment_id" => $pdo->lastInsertId()
        ]);
        exit;
    }

    if ($method === "GET" && $subPath === "") {
        // Listar todos los pagos
        $stmt = $pdo->query("SELECT * FROM payments ORDER BY description ASC");
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data"    => $payments
        ]);
        exit;
    }

    if ($method === "PUT" && preg_match("#^/([0-9]+)$#", $subPath, $matches)) {
        $id = (int)$matches[1];
        $input = json_decode(file_get_contents("php://input"), true);

        $fields = [];
        $params = [":id" => $id];

        if (isset($input["status"])) {
            $fields[] = "status = :status";
            $params[":status"] = $input["status"];
        }
        if (isset($input["amount"])) {
            $fields[] = "amount = :amount";
            $params[":amount"] = $input["amount"];
        }
        if (isset($input["method"])) {
            $fields[] = "method = :method";
            $params[":method"] = $input["method"];
        }
        if (isset($input["installments"])) {
            $fields[] = "installments = :installments";
            $params[":installments"] = $input["installments"];
        }
        if (isset($input["description"])) {
            $fields[] = "description = :description";
            $params[":description"] = $input["description"];
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No se enviaron campos para actualizar"]);
            exit;
        }

        $sql = "UPDATE payments SET " . implode(", ", $fields) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "message" => "Pago actualizado correctamente"
        ]);
        exit;
    }


    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Ruta no encontrada"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
