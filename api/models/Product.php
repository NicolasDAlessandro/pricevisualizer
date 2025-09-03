<?php
class Product {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($productData) {
        $sql = "INSERT INTO products (name, description, price, stock, category, image_url, seller_id) 
                VALUES (:name, :description, :price, :stock, :category, :image_url, :seller_id)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':name' => $productData['name'],
            ':description' => $productData['description'],
            ':price' => $productData['price'],
            ':stock' => $productData['stock'],
            ':category' => $productData['category'],
            ':image_url' => $productData['imageUrl'] ?? null,
            ':seller_id' => $productData['sellerId']
        ]);
        
        return $this->pdo->lastInsertId();
    }

    public function getAll($params = []) {
        $sql = "SELECT p.*, u.username as seller_name 
                FROM products p 
                JOIN users u ON p.seller_id = u.id 
                WHERE 1=1";
        
        $bindings = [];
        
        if (!empty($params['search'])) {
            $sql .= " AND (p.name LIKE :search OR p.description LIKE :search)";
            $bindings[':search'] = '%' . $params['search'] . '%';
        }
        
        if (!empty($params['category'])) {
            $sql .= " AND p.category = :category";
            $bindings[':category'] = $params['category'];
        }
        
        if (!empty($params['sellerId'])) {
            $sql .= " AND p.seller_id = :seller_id";
            $bindings[':seller_id'] = $params['sellerId'];
        }
        
        $sql .= " ORDER BY p.name ASC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($bindings);
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $sql = "SELECT p.*, u.username as seller_name 
                FROM products p 
                JOIN users u ON p.seller_id = u.id 
                WHERE p.id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function getBySeller($sellerId) {
        $sql = "SELECT * FROM products WHERE seller_id = :seller_id ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':seller_id' => $sellerId]);
        return $stmt->fetchAll();
    }

    public function update($id, $productData) {
        $sql = "UPDATE products SET 
                name = :name, 
                description = :description, 
                price = :price, 
                stock = :stock, 
                category = :category, 
                image_url = :image_url,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':name' => $productData['name'],
            ':description' => $productData['description'],
            ':price' => $productData['price'],
            ':stock' => $productData['stock'],
            ':category' => $productData['category'],
            ':image_url' => $productData['imageUrl'] ?? null,
            ':id' => $id
        ]);
    }

    public function delete($id) {
        $sql = "DELETE FROM products WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function bulkCreate($productsData) {
    $sql = "INSERT INTO products (id, name, description, price, stock, category, image_url, seller_id)
            VALUES (:id, :name, :description, :price, :stock, :category, :image_url, :seller_id)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                description = VALUES(description),
                price = VALUES(price),
                stock = VALUES(stock),  
                category = VALUES(category),
                image_url = VALUES(image_url),
                seller_id = VALUES(seller_id),
                updated_at = CURRENT_TIMESTAMP";

    $stmt = $this->pdo->prepare($sql);

    $successCount = 0;
    $errors = [];

    foreach ($productsData as $index => $productData) {
        try {
            $stmt->execute([
                ':id' => $productData['id'],  
                ':name' => $productData['name'],
                ':description' => $productData['description'],
                ':price' => $productData['price'],
                ':stock' => $productData['stock'],
                ':category' => $productData['category'],
                ':image_url' => $productData['imageUrl'] ?? null,
                ':seller_id' => $productData['sellerId']
            ]);
            $successCount++;
        } catch (Exception $e) {
            $errors[] = [
                'index' => $index,
                'product' => $productData['name'] ?? 'Unknown',
                'error' => $e->getMessage()
            ];
        }
    }

    return [
        'successCount' => $successCount,
        'errorCount' => count($errors),
        'errors' => $errors
        ];
    }

}
?>
