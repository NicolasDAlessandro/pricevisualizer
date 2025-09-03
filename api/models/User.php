<?php
class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($userData) {
        $sql = "INSERT INTO users (username, email, password, first_name, last_name, role) 
                VALUES (:username, :email, :password, :first_name, :last_name, :role)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':username' => $userData['username'],
            ':email' => $userData['email'],
            ':password' => password_hash($userData['password'], PASSWORD_BCRYPT),
            ':first_name' => $userData['firstName'],
            ':last_name' => $userData['lastName'],
            ':role' => $userData['role']
        ]);
        
        return $this->pdo->lastInsertId();
    }

    public function findByUsername($username) {
        $sql = "SELECT * FROM users WHERE username = :username";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':username' => $username]);
        return $stmt->fetch();
    }

    public function findById($id) {
        $sql = "SELECT id, username, email, first_name, last_name, role FROM users WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public function getAllSellers() {
        $sql = "SELECT id, username, email, first_name, last_name FROM users WHERE role = 'vendedor'";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }

    public function saveToken($userId, $token) {
        $sql = "UPDATE users SET auth_token = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$token, $userId]);
    }

    public function findByToken($token) {
        $sql = "SELECT id, username, email, first_name, last_name, role FROM users WHERE auth_token = ? LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$token]);
        return $stmt->fetch();
    }

    public function clearToken($userId) {
        $sql = "UPDATE users SET auth_token = NULL WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$userId]);
    }
}
?>
