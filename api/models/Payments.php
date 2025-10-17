<?php
class Payment {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        try {
            $sql = "INSERT INTO payments (user_id, amount, method, installments, description, status, created_at, updated_at)
                    VALUES (:user_id, :amount, :method, :installments, :description, :status, NOW(), NOW())";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':user_id'      => $data['user_id'],
                ':amount'       => $data['amount'],
                ':method'       => $data['method'],
                ':installments' => $data['installments'],
                ':description'  => $data['description'],
                ':status'       => $data['status']
            ]);

            error_log("Insert error: " . print_r($stmt->errorInfo(), true));
            $id = $this->pdo->lastInsertId();
            return $this->findById($id);
        } catch (Exception $e) {
            error_log("Error insertando payment: " . $e->getMessage());
            throw $e;
        }
    }


    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM payments ORDER BY description ASC");
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM payments WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function update($id, $fields) {
        $set = [];
        $params = [':id' => $id];

        foreach ($fields as $key => $value) {
            $set[] = "$key = :$key";
            $params[":$key"] = $value;
        }

        $sql = "UPDATE payments SET " . implode(", ", $set) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }
}
