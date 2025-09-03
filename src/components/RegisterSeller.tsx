import React, { useState, useEffect } from "react";

interface Seller {
  nombre: string;
  apellido: string;
  numeroVendedor: number;
}

const RegisterSeller: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numeroVendedor, setNumeroVendedor] = useState<number | "">("");
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("sellers");
    if (stored) {
      setSellers(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido || numeroVendedor === "") {
      alert("Todos los campos son obligatorios");
      return;
    }

    const newSeller: Seller = {
      nombre,
      apellido,
      numeroVendedor: Number(numeroVendedor),
    };

    const updated = [...sellers, newSeller];
    setSellers(updated);
    localStorage.setItem("sellers", JSON.stringify(updated));

    setNombre("");
    setApellido("");
    setNumeroVendedor("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        {/* Nombre */}
        <div className="mb-5">
          <label
            htmlFor="nombre"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Apellido */}
        <div className="mb-5">
          <label
            htmlFor="apellido"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Número de vendedor */}
        <div className="mb-5">
          <label
            htmlFor="numeroVendedor"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            N° de Vendedor
          </label>
          <input
            type="number"
            id="numeroVendedor"
            value={numeroVendedor}
            onChange={(e) =>
              setNumeroVendedor(
                e.target.value ? Number(e.target.value) : ""
              )
            }
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
        >
          Guardar Vendedor
        </button>
      </form>
    </div>
  );
};

export default RegisterSeller;
