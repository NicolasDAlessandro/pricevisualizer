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
    <div className="border border-black rounded p-3">
      <h3 className="font-semibold mb-2">Seleccionar formas de pago</h3>
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
        {availableMethods.map((m) => (
          <label key={m.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!selected[m.id]}
              onChange={() => toggleMethod(m.id)}
              className="form-checkbox"
            />
            <span>{m.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentSelector;
