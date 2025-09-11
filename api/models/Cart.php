<?php
class Cart {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getCart($userId) {
        $sql = "SELECT ci.*, p.*, u.username as seller_name 
                FROM cart_items ci 
                JOIN products p ON ci.product_id = p.id 
                JOIN users u ON p.seller_id = u.id 
                WHERE ci.user_id = :user_id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function addItem($userId, $productId, $quantity) {
     
        $sql = "SELECT * FROM cart_items WHERE user_id = :user_id AND product_id = :product_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId, ':product_id' => $productId]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            
            $sql = "UPDATE cart_items SET quantity = quantity + :quantity WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':quantity' => $quantity, ':id' => $existing['id']]);
            return $existing['id'];
        } else {
        
            $sql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':user_id' => $userId, ':product_id' => $productId, ':quantity' => $quantity]);
            return $this->pdo->lastInsertId();
        }
    }

    public function updateItem($itemId, $quantity) {
        $sql = "UPDATE cart_items SET quantity = :quantity WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':quantity' => $quantity, ':id' => $itemId]);
    }

    public function removeItem($itemId) {
        $sql = "DELETE FROM cart_items WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':id' => $itemId]);
    }

    public function clearCart($userId) {
        $sql = "DELETE FROM cart_items WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':user_id' => $userId]);
    }
}
?>
