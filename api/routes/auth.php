<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../models/User.php";

$userModel = new User($pdo);

// Obtener método y ruta
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// LOGIN
if ($method === 'POST' && $path === '/api/auth/login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Usuario y contraseña requeridos"]);
        exit;
    }
    
    $user = $userModel->findByUsername($data['username']);
    
    if ($user && $useRModel->verifyPassword($data['password'], $user['password'])) {
      
        $token = bin2hex(random_bytes(32));
        
        $userModel->saveToken($user['id'], $token);
        
        echo json_encode([
            "success" => true,
            "data" => [
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "email" => $user['email'],
                    "firstName" => $user['first_name'],
                    "lastName" => $user['last_name'],
                    "role" => $user['role']
                ]
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Credenciales inválidas"]);
    }
}

// REGISTRO
elseif ($method === 'POST' && $path === '/api/auth/register') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['username', 'email', 'password', 'firstName', 'lastName', 'role'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Campo requerido: $field"]);
            exit;
        }
    }
    
    $existing = $userModel->findByUsername($data['username']);
    if ($existing) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "El usuario ya existe"]);
        exit;
    }
    
    try {
        $userId = $userModel->create($data);
        echo json_encode([
            "success" => true,
            "data" => ["id" => $userId, "message极速加速器" => "Usuario creado exitosamente"]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al crear usuario"]);
    }
}

// PERFIL
elseif ($method === 'GET' && $path === '/api/auth/profile') {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token requerido"]);
        exit;
    }

    $user = $userModel->findByToken($token);
    if ($user) {
        echo json_encode([
            "success" => true,
            "data" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "firstName" => $user['first_name'],
                "lastName" => $user['last_name'],
                "role" => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token inválido"]);
    }
}

// LOGOUT
elseif ($method === 'POST' && $path === '/api/auth/logout') {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if ($token) {
        $user = $userModel->findByToken($token);
        if ($user) {
            $userModel->clearToken($user['id']);
        }
    }
    
    echo json_encode(["success" => true, "message" => "Sesión cerrada exitosamente"]);
}


elseif ($method === 'POST' && $path === '/api/auth/refresh') {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token requerido"]);
        exit;
    }

    $user = $userModel->findByToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token inválido"]);
        exit;
    }
    
    // Generar nuevo token
    $newToken = bin2hex(random_bytes(32));
    $userModel->saveToken($user['id'], $newToken);
    
    echo json_encode([
        "success" => true,
        "data" => ["token" => $newToken]
    ]);
}

else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Endpoint no encontrado"]);
}
?>
