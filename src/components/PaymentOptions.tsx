import React, { useEffect, useState } from "react";
import { paymentService } from "../services/api";

export type PaymentMethod = {
  id: string;
  name: string;
  cuotas: number;
  recargo: number; // (0.1 = 10%)
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
          name: p.description || p.method, 
          cuotas: Number(p.installments) || 1,
          recargo: p.amount, 
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
      <div className="max-h-72 overflow-y-auto border rounded shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-100 sticky top-0">
            <tr className="text-center">
              <th className="px-3 py-2 border">Forma de pago</th>
              <th className="px-3 py-2 border">Cuotas</th>
              <th className="px-3 py-2 border">Monto cuota</th>
              <th className="px-3 py-2 border">Total</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {methods.map((method) => {
              const total = price * (1 + method.recargo);
              const cuota = total / method.cuotas;

              return (
                <tr key={method.id} className="hover:bg-blue-50">
                  <td className="px-3 py-2 border">{method.name}</td>
                  <td className="px-3 py-2 border">{method.cuotas}</td>
                  <td className="px-3 py-2 border">${cuota.toFixed(2)}</td>
                  <td className="px-3 py-2 border">${total.toFixed(2)}</td>
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
