import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-sm w-full p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/*  Renderizado condicional: si NO hay token, mostramos el botón */}
          {!isAuthenticated ? (
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          ) : (
            <p className="text-green-600 font-semibold text-sm text-center">
              Ya estás logueado 
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
