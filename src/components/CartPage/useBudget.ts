// CartPage/usePresupuesto.ts
import { useMemo } from "react";
import type { PaymentMethod } from "../PaymentOptions";

export type ManualPayment = { nombre: string; cuotas: number; monto: number };

export type PresupuestoItem = {
  nombre: string;
  cuotas: number;
  montoCuota: number;
  total: number;
};

export type PresupuestoPorProducto = {
  producto: string;
  opciones: PresupuestoItem[];
};

type Garantia = { id: string; label: string; porcentaje: number };

export const GARANTIAS: Garantia[] = [
  { id: "g12", label: "GARANTÍA EXTENDIDA 12 MESES + MAX PROTECCIÓN", porcentaje: 0.095 },
  { id: "g24", label: "GARANTÍA EXTENDIDA 24 MESES + MAX PROTECCIÓN", porcentaje: 0.18 },
  { id: "f12", label: "FALLÓ CAMBIÓ 12 MESES + MAX PROTECCIÓN", porcentaje: 0.19 },
];

interface UsePresupuestoProps {
  modoIndividual: boolean;
  subtotal: number;
  items: any[];
  garantias: Record<string, boolean>;
  selectedMethods: PaymentMethod[];
  manualList: ManualPayment[];
}

const usePresupuesto = ({
  modoIndividual,
  subtotal,
  items,
  garantias,
  selectedMethods,
  manualList,
}: UsePresupuestoProps) => {
  return useMemo(() => {
    if (!modoIndividual) {
      // --- MODO TOTAL
      const result: PresupuestoItem[] = [];

      selectedMethods.forEach((m) => {
        const base = subtotal;
        let garantiasExtra = 0;

        GARANTIAS.forEach((g) => {
          if (garantias[g.id]) garantiasExtra += base * g.porcentaje;
        });

        const totalBase = base + garantiasExtra;
        const totalFinal = m.metodo === "tarjeta" ? totalBase * (1 + m.recargo) : totalBase * (1 - m.recargo);

        result.push({
          nombre: m.name,
          cuotas: m.cuotas,
          montoCuota: totalFinal / m.cuotas,
          total: totalFinal,
        });
      });

      manualList.forEach((m) => {
        result.push({
          nombre: m.nombre,
          cuotas: m.cuotas,
          montoCuota: m.monto,
          total: m.monto * m.cuotas,
        });
      });

      return result;
    } else {
      // --- MODO INDIVIDUAL
      const result: PresupuestoPorProducto[] = [];

      items.forEach((it) => {
        const productoTotal = it.product.precio * it.qty;
        const opciones: PresupuestoItem[] = [];

        selectedMethods.forEach((m) => {
          let garantiasExtra = 0;
          GARANTIAS.forEach((g) => {
            if (garantias[g.id]) garantiasExtra += productoTotal * g.porcentaje;
          });

          const totalBase = productoTotal + garantiasExtra;
          const totalFinal = m.metodo === "tarjeta" ? totalBase * (1 + m.recargo) : totalBase * (1 - m.recargo);

          opciones.push({
            nombre: m.name,
            cuotas: m.cuotas,
            montoCuota: totalFinal / m.cuotas,
            total: totalFinal,
          });
        });

        manualList.forEach((m) =>
          opciones.push({
            nombre: m.nombre,
            cuotas: m.cuotas,
            montoCuota: m.monto,
            total: m.monto * m.cuotas,
          })
        );

        result.push({ producto: it.product.detalle, opciones });
      });

      return result;
    }
  }, [modoIndividual, subtotal, garantias, selectedMethods, manualList, items]);
};

export default usePresupuesto;
