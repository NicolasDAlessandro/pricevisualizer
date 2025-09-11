import React, { useState, useEffect } from "react";
import { sellerService } from "../services/api";

interface Seller {
  id?: number;
  nombre: string;
  apellido: string;
  numeroVendedor: number;
  activo?: boolean;
}

const RegisterSeller: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numeroVendedor, setNumeroVendedor] = useState<number | "">("");
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    const sellers = await sellerService.getAll();
    setSellers(sellers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido || numeroVendedor === "") {
      alert("Todos los campos son obligatorios");
      return;
    }

    const newSeller: Seller = {
      nombre,
      apellido,
      numeroVendedor: Number(numeroVendedor),
      activo: true,
    };

    await sellerService.create(newSeller);
    await loadSellers();

    setNombre("");
    setApellido("");
    setNumeroVendedor("");
  };

  return (
    <div className="flex flex-row md:flex-row items-start justify-center min-h-screen bg-gray-900 space-y-6 md:space-y-0 md:space-x-8 p-6 text-white">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700"
      >
        <h2 className="text-xl font-bold mb-4 text-white text-center">Registrar Vendedor</h2>

        <div className="mb-4">
          <label htmlFor="nombre" className="block mb-1 font-medium text-gray-300">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="apellido" className="block mb-1 font-medium text-gray-300">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="numeroVendedor" className="block mb-1 font-medium text-gray-300">
            N° Vendedor
          </label>
          <input
            type="number"
            id="numeroVendedor"
            value={numeroVendedor}
            onChange={(e) =>
              setNumeroVendedor(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition shadow-md"
        >
          Guardar Vendedor
        </button>
      </form>

      {/* Tabla de vendedores */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md overflow-x-auto border border-gray-700">
        <h3 className="font-semibold mb-4 text-white text-center">Vendedores registrados</h3>
        <table className="w-full text-sm text-left text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead className="text-xs text-white uppercase bg-blue-800 text-center">
            <tr>
              <th className="px-4 py-2">N° Vendedor</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>
              <th className="px-4 py-2">Activo</th>
            </tr>
          </thead>
          <tbody>
            {sellers.length > 0 ? (
              sellers.map((s, idx) => (
                <tr
                  key={s.id ?? idx}
                  className={`${
                    idx % 2 === 0
                      ? "bg-gray-900 border-b border-gray-700"
                      : "bg-gray-700 border-b border-gray-600"
                  }`}
                >
                  <td className="px-4 py-2 text-center">{s.numeroVendedor}</td>
                  <td className="px-4 py-2">{s.nombre}</td>
                  <td className="px-4 py-2">{s.apellido}</td>
                  <td className="px-4 py-2 text-center">
                    {s.activo ? "✅" : "❌"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-400"
                >
                  No hay vendedores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterSeller;
