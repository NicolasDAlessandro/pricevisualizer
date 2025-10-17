// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import LandingPage from "./components/LandingPage";
import ProductUploader from "./components/ProductUploader";
import ProductTable from "./components/ProductTable";
import Cart from "./components/Cart";
import NavButton from "./components/NavButton";
import CreatePayment from "./components/CreatePayment";
import UpdatePayments from "./components/UpdatePayments";
import BudgetStats from "./components/BudgetStats";
import RegisterSeller from "./components/RegisterSeller";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 text-gray-200">
            <NavButton />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/register" 
                element={
                <ProtectedRoute roles={["admin","gerente"]}>
                  <Register />
                </ProtectedRoute>} />
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute roles={["admin", "gerente", "vendedor"]}>
                    <ProductTable />
                  </ProtectedRoute>} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute roles={["admin, gerente"]}>
                  <ProductUploader />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute roles={["admin", "gerente", "vendedor"]}>
                  <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-payment"
                element={
                  <ProtectedRoute roles={["admin", "gerente"]}>
                    <CreatePayment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-payment"
                element={
                  <ProtectedRoute roles={["admin", "gerente"]}>
                  <UpdatePayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget-stats"
                element={
                  <ProtectedRoute roles={["admin", "gerente", "vendedor"]}>
                  <BudgetStats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register-seller"
                element={
                  <ProtectedRoute roles={["admin"]}>
                  <RegisterSeller />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
