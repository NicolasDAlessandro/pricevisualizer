<?php
class Seller {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $sql = "INSERT INTO sellers (nombre, apellido, numero_vendedor, activo) 
                VALUES (:nombre, :apellido, :numero_vendedor, 1)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $data['nombre'],
            ':apellido' => $data['apellido'],
            ':numero_vendedor' => $data['numeroVendedor']
        ]);
        return $this->pdo->lastInsertId();
    }

    public function getAll($onlyActive = true) {
        $sql = "SELECT * FROM sellers";
        if ($onlyActive) {
            $sql .= " WHERE activo = 1";
        }
        $sql .= " ORDER BY numero_vendedor ASC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deactivate($id) {
        $sql = "UPDATE sellers SET activo = 0 WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function activate($id) {
        $sql = "UPDATE sellers SET activo = 1 WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}
