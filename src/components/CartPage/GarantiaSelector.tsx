import React from "react";

export type Garantia = {
  id: string;
  label: string;
  porcentaje: number;
};

type GarantiaSelectorProps = {
  garantias: Record<string, boolean>;
  toggleGarantia: (id: string) => void;
  GARANTIAS: Garantia[];
};


const GarantiaSelector: React.FC<GarantiaSelectorProps> = ({
  garantias,
  toggleGarantia,
  GARANTIAS,
}) => {
  return (
    <div className="mt-3">
      <h4 className="font-semibold text-sm mb-1">Garantías</h4>
      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-2">
        {GARANTIAS.map((g) => (
          <label key={g.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!garantias[g.id]}
              onChange={() => toggleGarantia(g.id)}
              className="form-checkbox"
            />
            <span>
              {g.label} (+{(g.porcentaje * 100).toFixed(1)}%)
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default GarantiaSelector;
