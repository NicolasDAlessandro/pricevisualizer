import React, { useEffect, useState } from "react";
import { paymentService } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

export type PaymentMethod = {
  id: string;
  name: string;
  cuotas: number;
  recargo: number; // 0.1 = 10%
  metodo: string;
};

type PaymentOptionsProps = {
  price: number;
};

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ price }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMethods = async () => {
      try {
        const payments = await paymentService.getPayments();

        const mapped: PaymentMethod[] = payments.map((p: any) => ({
          id: String(p.id),
          name: p.description,
          cuotas: Number(p.installments) || 1,
          recargo: Number(p.amount), // ya viene como 0.03 si es 3%
          metodo: p.method,
        }));

        setMethods(mapped);
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
              const esTarjeta = method.metodo.toLowerCase() !== "efectivo";
              const total = esTarjeta
                ? price * (1 + method.recargo)
                : price * (1 - method.recargo);

              const cuota = total / method.cuotas;

              return (
                <tr
                  key={method.id}
                  className="hover:bg-gray-700 transition-colors border-b border-gray-700"
                >
                  <td className="px-3 py-2 border border-gray-600">{method.name}</td>
                  <td className="px-3 py-2 border border-gray-600">{method.cuotas}</td>
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
