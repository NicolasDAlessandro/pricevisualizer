// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
//import ProtectedRoute from "./components/ProtectedRoute";
import './index.css';

// Landing page component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-12">
        {/* Título */}
        <div className="pb-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Sistema de Gestión de Precios
          </h1>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center space-y-4 border border-gray-700">
            <h3 className="text-xl font-semibold text-white">Gestión de Productos</h3>
            <p className="text-gray-400 text-sm">
              Administra tu catálogo de productos con precios y stock actualizado
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center space-y-4 border border-gray-700">
            <h3 className="text-xl font-semibold text-white">Carrito de Compras</h3>
            <p className="text-gray-400 text-sm">
              Crea y gestiona carritos para tus clientes de forma rápida
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center space-y-4 border border-gray-700">
            <h3 className="text-xl font-semibold text-white">Presupuestos</h3>
            <p className="text-gray-400 text-sm">
              Genera y envía presupuestos profesionales en segundos
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <a
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition duration-200"
          >
            Registrarse
          </a>
          <a
            href="/products"
            className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold shadow-md hover:bg-gray-800 hover:shadow-lg transition duration-200"
          >
            Ver Productos
          </a>
        </div>
      </div>
    </div>
  );
};

const Billing: React.FC = () => <div className="p-8">Billing Page (to be implemented)</div>;
const Invoice: React.FC = () => <div className="p-8">Invoice Page (to be implemented)</div>;

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
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductTable />} />
              <Route
                path="/upload"
                element={
                  //<ProtectedRoute roles={["admin", "vendedor"]}>
                  <ProductUploader />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  //<ProtectedRoute>
                  <Cart />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  //<ProtectedRoute>
                  <Billing />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/invoice"
                element={
                  //<ProtectedRoute>
                  <Invoice />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/create-payment"
                element={
                  //<ProtectedRoute>
                  <CreatePayment />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/update-payment"
                element={
                  //<ProtectedRoute roles={["admin", "gerente"]}>
                  <UpdatePayments />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/budget-stats"
                element={
                  //<ProtectedRoute roles={["admin", "gerente"]}>
                  <BudgetStats />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/register-seller"
                element={
                  //<ProtectedRoute roles={["admin"]}>
                  <RegisterSeller />
                  //</ProtectedRoute>
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
