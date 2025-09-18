<?php
class Budget {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAll($filters = []) {
        $sql = "SELECT b.*, u.username as vendedor 
                FROM budgets b 
                JOIN users u ON b.vendedor_id = u.id 
                WHERE 1=1";
        $params = [];

        if (!empty($filters['dateFrom'])) {
            $sql .= " AND b.created_at >= :dateFrom";
            $params[':dateFrom'] = $filters['dateFrom'];
        }
        if (!empty($filters['dateTo'])) {
            $sql .= " AND b.created_at <= :dateTo";
            $params[':dateTo'] = $filters['dateTo'];
        }
        if (!empty($filters['vendedor'])) {
            $sql .= " AND u.username LIKE :vendedor";
            $params[':vendedor'] = "%" . $filters['vendedor'] . "%";
        }
        if (!empty($filters['rubro'])) {
            $sql .= " AND b.rubro = :rubro";
            $params[':rubro'] = $filters['rubro'];
        }

        $sql .= " ORDER BY b.created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    public function getById($id) {
        $sql = "SELECT * FROM budgets WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $sql = "INSERT INTO budgets (user_id, vendedor_id, total_amount, rubro, status) 
                VALUES (:user_id, :vendedor_id, :total_amount, :rubro, :status)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $data['userId'],
            ':vendedor_id' => $data['vendedorId'],
            ':total_amount' => $data['totalAmount'],
            ':rubro' => $data['rubro'] ?? null,
            ':status' => $data['status'] ?? 'draft'
        ]);
        return $this->pdo->lastInsertId();
    }

    public function update($id, $data) {
        $sql = "UPDATE budgets 
                SET total_amount = :total_amount, rubro = :rubro, status = :status, updated_at = CURRENT_TIMESTAMP
                WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':total_amount' => $data['totalAmount'],
            ':rubro' => $data['rubro'] ?? null,
            ':status' => $data['status'],
            ':id' => $id
        ]);
    }

    public function delete($id) {
        $sql = "DELETE FROM budgets WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}
