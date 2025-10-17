
import React from "react";
import type { PresupuestoItem } from "./useBudget";
import { formatCurrency } from "../../utils/formatCurrency";
interface Props {
  data: PresupuestoItem[];
}

const PresupuestoTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded p-3 border border-gray-700 bg-gray-800 shadow">
      <h3 className="font-bold mb-2 text-green-400">Resumen del presupuesto</h3>
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
          {data.map((p, i) => (
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
  );
};

export default PresupuestoTable;
