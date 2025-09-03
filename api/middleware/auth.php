<?php
function verifyAuth($pdo) {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

    if (!$token) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token faltante"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE auth_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token inválido"]);
        exit;
    }

    return $user;
}
?>
