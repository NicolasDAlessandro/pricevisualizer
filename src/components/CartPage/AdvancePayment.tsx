import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

interface AdvancePaymentProps {
  entrega: number;
  setEntrega: (value: number) => void;
}

const AdvancePayment: React.FC<AdvancePaymentProps> = ({ entrega, setEntrega }) => {
  const [input, setInput] = useState(entrega || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input < 0) return alert("La entrega no puede ser negativa");
    setEntrega(input);
  };

  return (
    <div className="border border-gray-700 bg-gray-800 rounded p-3 shadow mt-4">
      <h3 className="text-blue-400 font-semibold mb-3">Simular entrega</h3>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <label htmlFor="entrega" className="text-sm text-gray-300">
          Monto entregado:
        </label>
        <input
          id="entrega"
          type="number"
          min={0}
          step={100}
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
          className="w-32 px-2 py-1 rounded bg-gray-900 text-gray-200 border border-gray-600"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Calcular
        </button>
      </form>

      {entrega > 0 && (
        <p className="mt-2 text-sm text-gray-400">
          Entrega aplicada: <span className="text-green-400">${formatCurrency(entrega)}</span>
        </p>
      )}
    </div>
  );
};

export default AdvancePayment;
