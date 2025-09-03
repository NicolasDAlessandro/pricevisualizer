import React, { useState } from "react";
import { paymentService } from "../services/api";
import Toast from "./Toast";

interface PaymentForm {
  amount: number;
  method: string;
  installments: number;
  description: string;
}

const CreatePayment: React.FC = () => {
  const [payment, setPayment] = useState<PaymentForm>({
    amount: 0,
    method: "",
    installments: 1,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPayment({
      ...payment,
      [name]: name === "amount" || name === "installments" 
        ? Number(value) 
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!payment.method.trim()) {
      setError("Ingrese una forma de pago");
      return;
    }

    if (payment.amount <= 0) {
      setError("Ingrese un monto válido");
      return;
    }

    setLoading(true);
    try {
      await paymentService.createPayment(payment);
      setToastMessage("Pago creado exitosamente");
      setPayment({
        amount: 0,
        method: "",
        installments: 1,
        description: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Crear Pago</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Monto */}
        <div className="mb-5">
          <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">
            Intereses
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={payment.amount}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Forma de pago */}
        <div className="mb-5">
          <label htmlFor="method" className="block mb-1 text-sm font-medium text-gray-700">
            Forma de pago
          </label>
          <select
            name="method"
            id="method"
            value={payment.method}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione método</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta de crédito</option>
            <option value="debito">Tarjeta de débito</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        {/* Cantidad de cuotas */}
        <div className="mb-5">
          <label htmlFor="installments" className="block mb-1 text-sm font-medium text-gray-700">
            Cantidad de cuotas
          </label>
          <input
            type="number"
            name="installments"
            id="installments"
            value={payment.installments}
            onChange={handleChange}
            min={1}
            max={12}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descripción */}
        <div className="mb-5">
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            value={payment.description}
            onChange={handleChange}
            rows={3}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción del pago..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Crear Pago"}
        </button>

        {toastMessage && (
          <Toast
            message={toastMessage}
            type="success"
            onClose={() => setToastMessage(null)}
          />
        )}
      </form>
    </div>
  );
};

export default CreatePayment;
