import React, { useState, useMemo, useEffect } from "react";
import { budgetService } from "../services/api";

interface Budget {
  id: number;
  vendedor: string;
  fecha: string;
  total: number;
  rubro?: string;
}

const BudgetStats: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rubro, setRubro] = useState("");
  const [rubros, setRubros] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const resp: any = await budgetService.getBudgets({
        vendedor: search,
        dateFrom,
        dateTo,
        rubro,
      });

      const data = Array.isArray(resp.data) ? resp.data : [];
      setBudgets(data);

      const uniqueRubros: string[] = Array.from(
        new Set<string>(
          data
            .map((b: any) => String(b.rubro || ""))
            .filter((r: string) => r !== "")
        )
      );

      setRubros(uniqueRubros);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar presupuestos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [search, dateFrom, dateTo, rubro]);

  const totalMonto = useMemo(
    () => budgets.reduce((acc, b) => acc + b.total, 0),
    [budgets]
  );

  if (loading) {
    return <p className="text-center text-gray-600">Cargando presupuestos...</p>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <button
          onClick={loadBudgets}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl text-center font-bold mb-4">
        Estadísticas de Presupuestos
      </h2>

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

        <label className="text-gray-700 text-sm font-medium">
          Rubro:
          <select
            value={rubro}
            onChange={(e) => setRubro(e.target.value)}
            className="border center px-7 py-1 rounded ml-2"
          >
            <option value="">Todos</option>
            {rubros.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-lg font-bold text-blue-500">{budgets.length}</p>
          <p className="text-sm text-gray-600">Presupuestos</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-lg font-bold text-blue-500">
            ${totalMonto.toFixed(2)}
          </p>
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
              <th className="px-6 py-3">Rubro</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length > 0 ? (
              budgets.map((b) => (
                <tr key={b.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{b.fecha}</td>
                  <td className="px-6 py-4">{b.vendedor}</td>
                  <td className="px-6 py-4">{b.rubro ?? "-"}</td>
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
