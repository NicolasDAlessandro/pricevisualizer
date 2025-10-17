import React, { useEffect, useState } from "react";
import { budgetService } from "../services/api";
import CategoryBudget from "./BudgetPage/CategoryBudget";
import PaymentBudget from "./BudgetPage/PaymentBudget";
import ProductBudget from "./BudgetPage/ProductBudget";
import SellerBudget from "./BudgetPage/SellerBudget";

const BudgetStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const resp = await budgetService.getStats({ dateFrom, dateTo });
      if (resp.success) setStats(resp.data);
      else throw new Error((resp as any).message || "Error al cargar estadísticas");
    } catch (err: any) {
      console.error("Error cargando estadísticas:", err);
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [dateFrom, dateTo]);

  if (loading)
    return <p className="text-center text-gray-600">Cargando estadísticas...</p>;

  if (error)
    return (
      <div className="text-center text-red-500 p-6">
        <p>{error}</p>
        <button
          onClick={loadStats}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );

  if (!stats) return null;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-200">
         Estadísticas de Presupuestos
      </h2>

      {/* --- Filtros de fechas --- */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
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

      {/* --- Gráfico: presupuestos por vendedor --- */}
      <SellerBudget sellers={stats.presupuestos_por_vendedor} />
      
      {/* --- Gráfico: productos más presupuestados --- */}
      <ProductBudget products={stats.productos_top} />

      {/* --- Componente: presupuestos por rubro --- */}
      <CategoryBudget rubros={stats.presupuestos_por_rubro} />

      {/* --- Gráfico: formas de pago más usadas --- */}
      <PaymentBudget payments={stats.formas_pago} />

    </div>
  );
};
export default BudgetStats;
