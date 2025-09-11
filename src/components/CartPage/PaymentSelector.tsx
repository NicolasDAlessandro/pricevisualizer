import React from "react";
import type { PaymentMethod } from "../PaymentOptions";

type PaymentSelectorProps = {
  availableMethods: PaymentMethod[];
  selected: Record<string, boolean>;
  toggleMethod: (id: string) => void;
};

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  availableMethods,
  selected,
  toggleMethod,
}) => {
  return (
    <div className="border border-gray-700 bg-gray-800 rounded p-3 h-56 flex flex-col shadow">
      <h3 className="font-semibold mb-2 text-blue-400">Seleccionar formas de pago</h3>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-2">
          {availableMethods.map((m) => (
            <label
              key={m.id}
              className="flex items-center gap-2 text-sm hover:text-white transition"
            >
              <input
                type="checkbox"
                checked={!!selected[m.id]}
                onChange={() => toggleMethod(m.id)}
                className="form-checkbox text-blue-500 focus:ring-green-500"
              />
              <span className="text-gray-300">{m.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

  );
};

export default PaymentSelector;
