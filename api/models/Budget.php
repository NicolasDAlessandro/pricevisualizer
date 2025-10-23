<?php
class Budget {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // LISTAR presupuestos con JOIN
    public function getAll($filters = []) {
        $sql = "SELECT 
                    b.id as budget_id,
                    b.created_at,
                    u.username as creado_por,
                    s.nombre as vendedor_nombre,
                    s.apellido as vendedor_apellido,
                    GROUP_CONCAT(p.description SEPARATOR ', ') AS formas_pago,
                    pr.detalle as producto,
                    pr.rubro,
                    bi.cantidad
                FROM budgets b
                JOIN users u ON b.user_id = u.id
                JOIN sellers s ON b.vendedor_id = s.id
                JOIN budget_items bi ON bi.budget_id = b.id
                JOIN products pr ON bi.producto_id = pr.id
                LEFT JOIN budget_payments bp ON bp.budget_id = b.id
                LEFT JOIN payments p ON bp.payment_id = p.id
                WHERE 1=1";
        $sql .= " GROUP BY b.id ORDER BY b.created_at DESC";
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
            $sql .= " AND (s.nombre LIKE :vendedor OR s.apellido LIKE :vendedor)";
            $params[':vendedor'] = "%" . $filters['vendedor'] . "%";
        }
        if (!empty($filters['rubro'])) {
            $sql .= " AND pr.rubro = :rubro";
            $params[':rubro'] = $filters['rubro'];
        }

        $sql .= " ORDER BY b.created_at DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // DETALLE de un presupuesto (con items)
    public function getById($id) {
        $sql = "SELECT 
                    b.id as budget_id,
                    b.created_at,
                    u.username as creado_por,
                    s.nombre as vendedor_nombre,
                    s.apellido as vendedor_apellido,
                    GROUP_CONCAT(p.description SEPARATOR ', ') AS formas_pago,
                    pr.detalle as producto,
                    pr.rubro,
                    bi.cantidad
                FROM budgets b
                JOIN users u ON b.user_id = u.id
                JOIN sellers s ON b.vendedor_id = s.id
                JOIN budget_items bi ON bi.budget_id = b.id
                JOIN products pr ON bi.producto_id = pr.id
                LEFT JOIN budget_payments bp ON bp.budget_id = b.id
                LEFT JOIN payments p ON bp.payment_id = p.id
                WHERE b.id = :id
                GROUP BY b.id, pr.id";


        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // CREAR un presupuesto + items
    public function create($data) {
        try {
            $this->pdo->beginTransaction();

            // Crear el presupuesto principal
            $sql = "INSERT INTO budgets (user_id, vendedor_id, created_at)
                    VALUES (:user_id, :vendedor_id, NOW())";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':user_id' => $data['userId'],
                ':vendedor_id' => $data['vendedorId'],
            ]);
            $budgetId = $this->pdo->lastInsertId();

            // Guardar productos
            $sqlItem = "INSERT INTO budget_items (budget_id, producto_id, cantidad)
                        VALUES (:budget_id, :producto_id, :cantidad)";
            $stmtItem = $this->pdo->prepare($sqlItem);
            foreach ($data['items'] as $item) {
                $stmtItem->execute([
                    ':budget_id' => $budgetId,
                    ':producto_id' => $item['productoId'],
                    ':cantidad' => $item['cantidad'],
                ]);
            }

            // Guardar formas de pago seleccionadas
            if (!empty($data['payments'])) {
                $sqlPayment = "INSERT INTO budget_payments (budget_id, payment_id)
                            VALUES (:budget_id, :payment_id)";
                $stmtPayment = $this->pdo->prepare($sqlPayment);
                foreach ($data['payments'] as $paymentId) {
                    $stmtPayment->execute([
                        ':budget_id' => $budgetId,
                        ':payment_id' => $paymentId,
                    ]);
                }
            }

            $this->pdo->commit();
            return $budgetId;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }


    public function getStats($filters = []) {

        $stats = [];

        //  Cantidad de presupuestos por vendedor
        $sql = "SELECT s.id, s.nombre, s.apellido, COUNT(b.id) AS total
                FROM budgets b
                JOIN sellers s ON b.vendedor_id = s.id
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

        $sql .= " GROUP BY s.id ORDER BY total DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $stats['presupuestos_por_vendedor'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Productos más presupuestados
        $sql = "SELECT pr.id, pr.description AS producto, pr.category AS rubro, SUM(bi.cantidad) AS total
                FROM budget_items bi
                JOIN products pr ON bi.producto_id = pr.id
                JOIN budgets b ON bi.budget_id = b.id
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

        $sql .= " GROUP BY pr.id ORDER BY total DESC LIMIT 10";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $stats['productos_top'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Presupuestos por rubro
        $sql = "SELECT pr.category AS rubro, SUM(bi.cantidad) AS total
                FROM budget_items bi
                JOIN products pr ON bi.producto_id = pr.id
                JOIN budgets b ON bi.budget_id = b.id
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

        $sql .= " GROUP BY pr.category ORDER BY total DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $stats['presupuestos_por_rubro'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Formas de pago más usadas
        $sql = "SELECT p.description AS forma_pago, COUNT(*) AS total
                FROM budget_payments bp
                JOIN payments p ON bp.payment_id = p.id
                JOIN budgets b ON bp.budget_id = b.id
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

        $sql .= " GROUP BY p.id ORDER BY total DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $stats['formas_pago'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $stats;
    }



    // ELIMINAR un presupuesto
    public function delete($id) {
        $sql = "DELETE FROM budgets WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}
