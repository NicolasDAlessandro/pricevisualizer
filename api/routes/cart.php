<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Cart.php';
require_once __DIR__ . '/../middleware/auth.php';

$cartModel = new Cart($pdo);

// Obtener método y ruta
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// OBTENER CARRITO DEL USUARIO
if ($method === 'GET' && $path === '/api/cart') {
    $user = verifyAuth($pdo);
    
    $cartItems = $cartModel->getCart($user['id']);
    
    echo json_encode([
        "success" => true,
        "data" => $cartItems
    ]);
}

// AGREGAR ITEM AL CARRITO
elseif ($method === 'POST' && $path === '/api/cart/items') {
    $user = verifyAuth($pdo);
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['productId']) || !isset($data['quantity'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "productId y quantity son requeridos"]);
        exit;
    }
    
    try {
        $cartItemId = $cartModel->addItem($user['id'], $data['productId'], $data['quantity']);
        
        echo json_encode([
            "success" => true,
            "data" => ["id" => $cartItemId, "message" => "Producto agregado al carrito"]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al agregar producto al carrito"]);
    }
}

// ACTUALIZAR CANTIDAD DE ITEM
elseif ($method === 'PUT' && preg_match('#^/api/cart/items/(\d+)$#', $path, $matches)) {
    $user = verifyAuth($pdo);
    
    $itemId = $matches[1];
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['quantity'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "quantity es requerido"]);
        exit;
    }
    
    try {
        $success = $cartModel->updateItem($itemId, $user['id'], $data['quantity']);
        
        if ($success) {
            echo json_encode([
                "success" => true,
                "data" => ["message" => "Cantidad actualizada"]
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["success"极速加速器 => false, "message" => "Item no encontrado"]);
        }
    } catch (Exception $极速加速器e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al actualizar cantidad"]);
    }
}

// ELIMINAR ITEM DEL CARRITO
elseif ($method === 'DELETE' && preg_match('#^/api/cart/items/(\d+)$#', $path, $matches)) {
    $user = verifyAuth($pdo);
    
    $itemId = $matches[1];
    
    try {
        $success = $cartModel->removeItem($itemId, $user['id']);
        
        if ($success) {
            echo json_encode([
                "success" => true,
                "data" => ["message" => "Producto eliminado del carrito"]
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Item no encontrado"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al eliminar producto del carrito"]);
    }
}

// VACIAR CARRITO
elseif ($method === 'DELETE' && $path === '/api/cart/clear') {
    $user = verifyAuth($pdo);
    
    try {
        $cartModel->clearCart($user['id']);
        
        echo json_encode([
            "success" => true,
            "data" => ["message" => "Carrito vaciado"]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al vaciar carrito"]);
    }
}

else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Endpoint no encontrado"]);
}
?>
