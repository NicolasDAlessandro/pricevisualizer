import React, { useEffect, useState } from "react";
import { paymentService } from "../services/api";

export type PaymentMethod = {
  id: string;
  name: string;
  cuotas: number;
  recargo: number; // (0.1 = 10%)
  metodo: string;
};

type PaymentMethodsListProps = {
  price: number;
};

const PaymentOptions: React.FC<PaymentMethodsListProps> = ({ price }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMethods = async () => {
      try {
        const payments = await paymentService.getPayments();

        const mapped = payments.map((p: any) => ({
          id: String(p.id),
          name: p.description, 
          cuotas: Number(p.installments) || 1,
          recargo: p.amount, 
          metodo : p.method,
        }));


        setMethods(mapped);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar métodos de pago");
      } finally {
        setLoading(false);
      }
    };

    loadMethods();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Cargando métodos de pago...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      {/*  Tabla scrolleable verticalmente */}
      <div className="max-h-72 overflow-y-auto border border-gray-700 rounded shadow-sm bg-gray-800">
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

              const total = method.metodo == "tarjeta" ? price * (1 + method.recargo): price * (1 - method.recargo);
              const cuota = total / method.cuotas;

              return (
                <tr
                  key={method.id}
                  className="hover:bg-gray-700 transition border-b border-gray-700"
                >
                  <td className="px-3 py-2 border border-gray-600">{method.name}</td>
                  <td className="px-3 py-2 border border-gray-600">{method.cuotas}</td>
                  <td className="px-3 py-2 border border-gray-600 text-blue-400">
                    ${cuota.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 border border-gray-600 text-green-400">
                    ${total.toFixed(2)}
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
