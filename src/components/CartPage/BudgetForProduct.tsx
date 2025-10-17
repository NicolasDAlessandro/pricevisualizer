import React from "react";
import type { PresupuestoPorProducto } from "./useBudget";
import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  data: PresupuestoPorProducto[];
}

const PresupuestoPorProductoTable: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((grupo, idx) => (
        <div
          key={idx}
          className="rounded p-3 border border-gray-700 bg-gray-800 mb-4 shadow"
        >
          <h3 className="font-bold mb-2 text-blue-400">{grupo.producto}</h3>
          <table className="table-auto w-full text-sm text-center border border-gray-700 rounded overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border border-gray-600 px-2 py-1">Forma de pago</th>
                <th className="border border-gray-600 px-2 py-1">Cuotas</th>
                <th className="border border-gray-600 px-2 py-1">Monto cuota</th>
                <th className="border border-gray-600 px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {grupo.opciones.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 transition border-b border-gray-700"
                >
                  <td className="px-2 py-1">{p.nombre}</td>
                  <td className="px-2 py-1">{p.cuotas}</td>
                  <td className="px-2 py-1 text-blue-400">${formatCurrency(p.montoCuota)}</td>
                  <td className="px-2 py-1 text-green-400">${formatCurrency(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export default PresupuestoPorProductoTable;
