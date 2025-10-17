<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . '/../middleware/auth.php'; 

$userModel = new User($pdo);
// Obtener método y ruta
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Función de helper para respuestas JSON
function sendResponse($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}
// LOGIN
if ($method === 'POST' && $path === '/api/auth/login') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['username']) || empty($data['password'])) {
            sendResponse(400, ["success" => false, "message" => "Usuario y contraseña requeridos"]);
        }

        $user = $userModel->findByUsername($data['username']);

        if ($user && $userModel->verifyPassword($data['password'], $user['password'])) {
            $token = bin2hex(random_bytes(32));
            $userModel->saveToken($user['id'], $token);

            sendResponse(200, [
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
            sendResponse(401, ["success" => false, "message" => "Credenciales inválidas"]);
        }
    } catch (Exception $e) {
        error_log("Error en LOGIN: " . $e->getMessage());
        sendResponse(500, ["success" => false, "message" => "Error interno en login", "error" => $e->getMessage()]);
    }
}

// REGISTRO
elseif ($method === 'POST' && $path === '/api/auth/register') {
    try {
        $user = verifyAuth($pdo); 

        if (!$user) {
            error_log("verifyAuth devolvió null o falló");
            sendResponse(401, ["success" => false, "message" => "Token inválido o expirado"]);
        }

        if ($user['role'] !== 'admin') {
            sendResponse(403, ["success" => false, "message" => "Solo un admin puede registrar usuarios"]);
        }
        $data = json_decode(file_get_contents('php://input'), true);

        $required = ['username', 'email', 'password', 'firstName', 'lastName', 'role'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                sendResponse(400, ["success" => false, "message" => "Campo requerido: $field"]);
            }
        }

        $existing = $userModel->findByUsername($data['username']);
        if ($existing) {
            sendResponse(409, ["success" => false, "message" => "El usuario ya existe"]);
        }

        $userId = $userModel->create($data);
        sendResponse(201, [
            "success" => true,
            "data" => ["id" => $userId, "message" => "Usuario creado exitosamente"]
        ]);

    } catch (Exception $e) {
        error_log("Error en REGISTER: " . $e->getMessage());
        sendResponse(500, ["success" => false, "message" => "Error al crear usuario", "error" => $e->getMessage()]);
    }
}
// PERFIL
elseif ($method === 'GET' && $path === '/api/auth/profile') {
    try {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if (!$token) {
            sendResponse(401, ["success" => false, "message" => "Token requerido"]);
        }

        $user = $userModel->findByToken($token);
        if ($user) {
            sendResponse(200, [
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
            sendResponse(401, ["success" => false, "message" => "Token inválido"]);
        }
    } catch (Exception $e) {
        error_log("Error en PROFILE: " . $e->getMessage());
        sendResponse(500, ["success" => false, "message" => "Error al obtener perfil", "error" => $e->getMessage()]);
    }
}
// LOGOUT
elseif ($method === 'POST' && $path === '/api/auth/logout') {
    try {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if ($token) {
            $user = $userModel->findByToken($token);
            if ($user) {
                $userModel->clearToken($user['id']);
            }
        }

        sendResponse(200, ["success" => true, "message" => "Sesión cerrada exitosamente"]);
    } catch (Exception $e) {
        error_log("Error en LOGOUT: " . $e->getMessage());
        sendResponse(500, ["success" => false, "message" => "Error al cerrar sesión", "error" => $e->getMessage()]);
    }
}
// REFRESH
elseif ($method === 'POST' && $path === '/api/auth/refresh') {
    try {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if (!$token) {
            sendResponse(401, ["success" => false, "message" => "Token requerido"]);
        }

        $user = $userModel->findByToken($token);
        if (!$user) {
            sendResponse(401, ["success" => false, "message" => "Token inválido"]);
        }

        $newToken = bin2hex(random_bytes(32));
        $userModel->saveToken($user['id'], $newToken);

        sendResponse(200, ["success" => true, "data" => ["token" => $newToken]]);
    } catch (Exception $e) {
        error_log("Error en REFRESH: " . $e->getMessage());
        sendResponse(500, ["success" => false, "message" => "Error al refrescar token", "error" => $e->getMessage()]);
    }
}
// NOT FOUND
else {
    sendResponse(404, ["success" => false, "message" => "Endpoint no encontrado", "path" => $path]);
}
