<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Product.php';
//require_once __DIR__ . '/../middleware/auth.php'; //  Desactivado

$productModel = new Product($pdo);

// Obtener método y ruta
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// LISTAR TODOS LOS PRODUCTOS
if ($method === 'GET' && $path === '/api/products') {
    $params = $_GET;
    $products = $productModel->getAll($params);
    
    echo json_encode([
        "success" => true,
        "data" => $products
    ]);
}

// OBTENER PRODUCTO POR ID
elseif ($method === 'GET' && preg_match('#^/api/products/(\d+)$#', $path, $matches)) {
    $product = $productModel->getById($matches[1]);
    
    if ($product) {
        echo json_encode([
            "success" => true,
            "data" => $product
        ]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Producto no encontrado"]);
    }
}

// CREAR PRODUCTO
elseif ($method === 'POST' && $path === '/api/products') {
    //$user = verifyAuth($pdo); //
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['name', 'description', 'price', 'stock', 'category'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Campo requerido: $field"]);
            exit;
        }
    }
    
    try {
        // $data['sellerId'] = $user['id']; // 
        $data['sellerId'] = 1; //  Valor fijo para pruebas!!
        $productId = $productModel->create($data);
        
        echo json_encode([
            "success" => true,
            "data" => ["id" => $productId, "message" => "Producto creado exitosamente"]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al crear producto"]);
    }
}

// ACTUALIZAR PRODUCTO
elseif ($method === 'PUT' && preg_match('#^/api/products/(\d+)$#', $path, $matches)) {
    //$user = verifyAuth($pdo); // 
    
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $matches[1];
    
    try {
        $success = $productModel->update($productId, $data);
        
        if ($success) {
            echo json_encode([
                "success" => true,
                "data" => ["message" => "Producto actualizado exitosamente"]
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Producto no encontrado"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al actualizar producto"]);
    }
}

// ELIMINAR PRODUCTO
elseif ($method === 'DELETE' && preg_match('#^/api/products/(\d+)$#', $path, $matches)) {
    //$user = verifyAuth($pdo); // 
    
    $productId = $matches[1];
    
    try {
        $success = $productModel->delete($productId);
        
        if ($success) {
            echo json_encode([
                "success" => true,
                "data" => ["message" => "Producto eliminado exitosamente"]
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Producto no encontrado"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al eliminar producto"]);
    }
}

// OBTENER PRODUCTOS POR VENDEDOR
elseif ($method === 'GET' && preg_match('#^/api/products/seller/(\d+)$#', $path, $matches)) {
    $sellerId = $matches[1];
    $products = $productModel->getBySeller($sellerId);
    
    echo json_encode([
        "success" => true,
        "data" => $products
    ]);
}

// CARGA MASIVA DE PRODUCTOS DESDE EXCEL 
elseif ($method === 'POST' && $path === '/api/products/bulk') {
    //$user = verifyAuth($pdo); // 
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['products']) || !is_array($data['products'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Datos de productos no válidos"]);
        exit;
    }
    
    $products = [];
    $errors = [];
    
    foreach ($data['products'] as $index => $productData) {
        // Validar campos obligatorios
        if (empty($productData['name'])) {
            $errors[] = "Producto $index: Nombre es obligatorio";
            continue;
        }
        
        if (!isset($productData['price']) || $productData['price'] === '') {
            $errors[] = "Producto $index: Precio es obligatorio";
            continue;
        }
        
        if (!isset($productData['stock']) || $productData['stock'] === '') {
            $errors[] = "Producto $index: Stock es obligatorio";
            continue;
        }
        
        // Mapear a estructura de base de datos
        $products[] = [
            'id' => intval($productData['id']),  // 
            'name' => strval($productData['name']),
            'description' => strval($productData['description'] ?? $productData['name']),
            'price' => floatval($productData['price']),
            'stock' => intval($productData['stock']),
            'category' => strval($productData['category'] ?? 'General'),
            'imageUrl' => $productData['imageUrl'] ?? null,
            'sellerId' => 1 // Valor fijo para pruebas
        ];
    }
    
    if (empty($products)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "No se encontraron productos válidos",
            "errors" => $errors
        ]);
        exit;
    }
    
    // Insertar productos en lote
    $result = $productModel->bulkCreate($products);
    
    echo json_encode([
        "success" => true,
        "data" => [
            "message" => "Carga masiva completada",
            "totalProcessed" => count($products),
            "successCount" => $result['successCount'],
            "errorCount" => $result['errorCount'],
            "errors" => array_merge($errors, $result['errors'])
        ]
    ]);
}

else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Endpoint no encontrado"]);
}
?>
