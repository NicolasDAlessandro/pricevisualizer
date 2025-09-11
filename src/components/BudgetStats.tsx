import React, { useState, useMemo, useEffect } from "react";

interface Budget {
  id: number;
  vendedor: string; 
  fecha: string; 
  total: number;
}

const BudgetStats: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("presupuestos");
    if (stored) {
      setBudgets(JSON.parse(stored));
    }
  }, []);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => {
      const fecha = new Date(b.fecha);
      const desde = dateFrom ? new Date(dateFrom) : null;
      const hasta = dateTo ? new Date(dateTo) : null;

      const matchFecha =
        (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
      const matchTexto = search
        ? b.vendedor.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchFecha && matchTexto;
    });
  }, [budgets, search, dateFrom, dateTo]);

  const totalMonto = useMemo(
    () => filteredBudgets.reduce((acc, b) => acc + b.total, 0),
    [filteredBudgets]
  );

  return (
    <div className="p-4">
      <h2 className="text-xl text-center font-bold mb-4">Estadísticas de Presupuestos</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Buscar por vendedor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded w-64"
        />

        <label className="text-gray-700 text-sm font-medium">
          Desde:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border px-3 py-1 rounded ml-2"
          />
        </label>

        <label className="text-gray-700 text-sm font-medium">
          Hasta:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border px-3 py-1 rounded ml-2"
          />
        </label>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-lg font-bold text-blue-500">{filteredBudgets.length}</p>
          <p className="text-sm text-gray-600">Presupuestos</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-lg font-bold text-blue-500">${totalMonto.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Monto total</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-blue-800">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Vendedor</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((b) => (
                <tr key={b.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{b.fecha}</td>
                  <td className="px-6 py-4">{b.vendedor}</td>
                  <td className="px-6 py-4">${b.total.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No hay presupuestos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetStats;
