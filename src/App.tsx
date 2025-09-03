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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Sistema de Gestión de Precios
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Gestiona productos, carritos y presupuestos de manera eficiente
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Gestión de Productos</h3>
            <p className="text-gray-600">Administra tu catálogo de productos con precios y stock</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Carrito de Compras</h3>
            <p className="text-gray-600">Crea y gestiona carritos para tus clientes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Presupuestos</h3>
            <p className="text-gray-600">Genera y envía presupuestos profesionales</p>
          </div>
        </div>

        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
          >
            Registrarse
          </a>
          <a
            href="/products"
            className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-200"
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
          <div className="min-h-screen bg-gray-50">
            <NavButton />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductTable />} />
              <Route path="/upload" element={
                //<ProtectedRoute roles={["admin", "vendedor"]}>
                  <ProductUploader />
                //</ProtectedRoute>
              } />
              <Route path="/cart" element={
                //<ProtectedRoute>
                  <Cart />
                //</ProtectedRoute>
              } />
              <Route path="/billing" element={
                //<ProtectedRoute>
                  <Billing />
                //</ProtectedRoute>
              } />
              <Route path="/invoice" element={
                //<ProtectedRoute>
                  <Invoice />
                //</ProtectedRoute>
              } />
              <Route path="/create-payment" element={
                //<ProtectedRoute>
                  <CreatePayment />
                //</ProtectedRoute>
              } />
              <Route path="/update-payment" element={
                //<ProtectedRoute roles={["admin", "gerente"]}>
                  <UpdatePayments />
                //</ProtectedRoute>
              } />
              <Route path="/budget-stats" element={
                //<ProtectedRoute roles={["admin", "gerente"]}>
                  <BudgetStats />
                //</ProtectedRoute>
              } />
              <Route path="/register-seller" element={
                //<ProtectedRoute roles={["admin"]}>
                  <RegisterSeller />
                //</ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
