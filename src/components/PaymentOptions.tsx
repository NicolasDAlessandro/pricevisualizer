import React, { useEffect, useState } from "react";
import { paymentService } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import type { PaymentDto } from "../types/Api";

type PaymentOptionsProps = {
  price: number;
};

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ price }) => {
  const [methods, setMethods] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMethods = async () => {
      try {
        const payments: PaymentDto[] = await paymentService.getPayments();
        setMethods(payments);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar métodos de pago");
      } finally {
        setLoading(false);
      }
    };

    loadMethods();
  }, [price]);

  if (loading) {
    return <p className="text-center text-gray-400">Cargando métodos de pago...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (methods.length === 0) {
    return <p className="text-center text-gray-400">No hay métodos de pago disponibles.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="max-h-72 overflow-y-auto border border-gray-700 rounded-lg shadow bg-gray-800">
        <table className="w-full text-sm text-gray-300 border-collapse">
          <thead className="sticky top-0 bg-blue-700 text-white uppercase text-xs">
            <tr className="text-center">
              <th className="px-3 py-2 border border-gray-600">Forma de pago</th>
              <th className="px-3 py-2 border border-gray-600">Cuotas</th>
              <th className="px-3 py-2 border border-gray-600">Monto cuota</th>
              <th className="px-3 py-2 border border-gray-600">Total</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {methods.map((method) => {
              // Renderiza solo métodos activos
              if (method.status !== 1) return null
              
              const recargo = method.amount / 1 ;
              const esTarjeta = method.method.toLowerCase() !== "efectivo"; 
              const total = esTarjeta ? price * (1 + recargo) : price * (1 - recargo); 
              const cuota = total / (method.installments || 1);
          
              return (
                <tr
                  key={method.id}
                  className="hover:bg-gray-700 transition-colors border-b border-gray-700"
                >
                  <td className="px-3 py-2 border border-gray-600">{method.description}</td>
                  <td className="px-3 py-2 border border-gray-600">{method.installments}</td>
                  <td className="px-3 py-2 border border-gray-600 text-blue-400 font-semibold">
                    ${formatCurrency(cuota)}
                  </td>
                  <td className="px-3 py-2 border border-gray-600 text-green-400 font-semibold">
                    ${formatCurrency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentOptions;
