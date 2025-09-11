import React, { useEffect, useState } from "react";
import { paymentService } from "../services/api";
import type { PaymentDto } from "../types/Api";
import Toast from "./Toast";

const UpdatePayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentService.getPayments();
      setPayments(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payment: PaymentDto) => {
    try {
      await paymentService.updatePayment(payment.id, {
        amount: payment.amount,
        method: payment.method,
        installments: payment.installments,
        description: payment.description,
        status: payment.status,
      });
      setToastMessage("Pago actualizado correctamente");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar el pago");
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Cargando pagos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={loadPayments}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Actualizar formas de pagos</h2>

      {payments.length === 0 ? (
        <p className="text-center text-gray-400">No hay pagos registrados</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
            <thead className="text-xs text-white uppercase bg-blue-800">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Intereses</th>
                <th className="px-6 py-3">Método</th>
                <th className="px-6 py-3">Cuotas</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-800 border-b border-gray-700"
                      : "bg-gray-700 border-b border-gray-600"
                  } hover:bg-gray-600`}
                >
                  <td className="px-6 py-4">{payment.id}</td>

                  {/* Monto */}
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min={0}
                      value={payment.amount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        const newPayments = [...payments];
                        newPayments[index].amount = value < 0 ? 0 : value;
                        setPayments(newPayments);
                      }}
                      className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>

                  {/* Método */}
                  <td className="px-6 py-4">
                    <select
                      value={payment.method}
                      onChange={(e) => {
                        const newPayments = [...payments];
                        newPayments[index].method = e.target.value;
                        setPayments(newPayments);
                      }}
                      className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="tarjeta">Tarjeta</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </td>

                  {/* Cuotas */}
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min={1}
                      value={payment.installments}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const newPayments = [...payments];
                        newPayments[index].installments = value < 1 ? 1 : value;
                        setPayments(newPayments);
                      }}
                      className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>

                  {/* Descripción */}
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={payment.description || ""}
                      onChange={(e) => {
                        const newPayments = [...payments];
                        newPayments[index].description = e.target.value;
                        setPayments(newPayments);
                      }}
                      className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <select
                      value={payment.status}
                      onChange={(e) => {
                        const newPayments = [...payments];
                        newPayments[index].status = e.target.value as any;
                        setPayments(newPayments);
                      }}
                      className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="completed">Completado</option>
                      <option value="failed">Fallido</option>
                    </select>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>

                  {/* Botón Guardar */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSave(payment)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow-md"
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default UpdatePayments;
