// CartPage/GarantiasSelector.tsx
import React from "react";
import { GARANTIAS } from "./useBudget";

interface Props {
  garantias: Record<string, boolean>;
  setGarantias: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const GarantiasSelector: React.FC<Props> = ({ garantias, setGarantias }) => {
  const toggleGarantia = (id: string) =>
    setGarantias((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="mt-3 flex-1">
      <h4 className="font-semibold text-sm mb-1 text-red-400">Garantías</h4>
      <div className="flex flex-col gap-1 max-h-full overflow-y-auto pr-2">
        {GARANTIAS.map((g) => (
          <label
            key={g.id}
            className="flex items-center gap-2 text-sm hover:text-white"
          >
            <input
              type="checkbox"
              checked={!!garantias[g.id]}
              onChange={() => toggleGarantia(g.id)}
              className="form-checkbox text-blue-500 focus:ring-green-500"
            />
            <span>
              {g.label}{" "}
              <span className="text-gray-400">
                (+{(g.porcentaje * 100).toFixed(1)}%)
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default GarantiasSelector;
