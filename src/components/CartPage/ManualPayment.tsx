// CartPage/ManualPaymentForm.tsx
import React, { useState } from "react";
import type { ManualPayment } from "./useBudget";

interface Props {
  manualList: ManualPayment[];
  setManualList: React.Dispatch<React.SetStateAction<ManualPayment[]>>;
}

const ManualPaymentForm: React.FC<Props> = ({  setManualList }) => {
  const [manualValues, setManualValues] = useState<ManualPayment>({
    nombre: "",
    cuotas: 0,
    monto: 0,
  });

  const addManual = () => {
    if (
      manualValues.nombre.trim() &&
      manualValues.cuotas > 0 &&
      manualValues.monto > 0
    ) {
      setManualList((prev) => [...prev, manualValues]);
      setManualValues({ nombre: "", cuotas: 0, monto: 0 });
    }
  };

  return (
    <div className="border border-gray-700 bg-gray-800 rounded p-3 shadow">
      <h3 className="font-semibold mb-2 text-blue-400">Ingreso manual</h3>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm">Nombre</label>
          <input
            type="text"
            value={manualValues.nombre}
            onChange={(e) =>
              setManualValues({ ...manualValues, nombre: e.target.value })
            }
            className="border border-gray-600 bg-gray-900 px-2 py-1 rounded w-48 focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Promo banco, Plan especial"
          />
        </div>
        <div>
          <label className="block text-sm">Cuotas</label>
          <input
            type="number"
            min={1}
            value={manualValues.cuotas}
            onChange={(e) =>
              setManualValues({
                ...manualValues,
                cuotas: Math.max(1, Number(e.target.value)),
              })
            }
            className="border border-gray-600 bg-gray-900 px-2 py-1 rounded w-20 text-center focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm">Monto por cuota</label>
          <input
            type="number"
            min={1}
            value={manualValues.monto}
            onChange={(e) =>
              setManualValues({
                ...manualValues,
                monto: Math.max(1, Number(e.target.value)),
              })
            }
            className="border border-gray-600 bg-gray-900 px-2 py-1 rounded w-28 text-center focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addManual}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ManualPaymentForm;
