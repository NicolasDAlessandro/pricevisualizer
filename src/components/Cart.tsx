import React, { useMemo, useState, useEffect } from "react";
import type { PaymentMethod } from "./PaymentOptions";
import { useCart } from "../context/CartContext";
import { paymentService } from "../services/api";
import { generarPDF } from "../utils/pdfGenerator";
import CartProducts from "./CartPage/CartProducts";
import PaymentSelector from "./CartPage/PaymentSelector";
// import GarantiaSelector from "./CartPage/GarantiaSelector"; 

type ManualPayment = { nombre: string; cuotas: number; monto: number };
type PresupuestoItem = {
  nombre: string;
  cuotas: number;
  montoCuota: number;
  total: number;
};
type Garantia = { id: string; label: string; porcentaje: number };

const GARANTIAS: Garantia[] = [
  { id: "g12", label: "GARANTÍA EXTENDIDA 12 MESES + MAX PROTECCIÓN", porcentaje: 0.095 },
  { id: "g24", label: "GARANTÍA EXTENDIDA 24 MESES + MAX PROTECCIÓN", porcentaje: 0.18 },
  { id: "f12", label: "FALLÓ CAMBIÓ 12 MESES + MAX PROTECCIÓN", porcentaje: 0.19 },
];


const CartPage: React.FC = () => {
  const { items, subtotal } = useCart();
  const [garantias, setGarantias] = useState<Record<string, boolean>>({});
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [manualValues, setManualValues] = useState<ManualPayment>({
    nombre: "",
    cuotas: 0,
    monto: 0,
  });
  const [manualList, setManualList] = useState<ManualPayment[]>([]);

  // toggles
  const toggleMethod = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const selectedMethods = useMemo(
    () => availableMethods.filter((m) => selected[m.id]),
    [availableMethods, selected]
  );

  const toggleGarantia = (id: string) =>
  setGarantias((prev) => ({ ...prev, [id]: !prev[id] }));

  
  const addManual = () => {
    if (
      manualValues.nombre.trim() &&
      manualValues.cuotas > 0 &&
      manualValues.monto > 0
    ) {
      setManualList((prev) => [...prev, manualValues]);
      setManualValues({ nombre: "", cuotas: 0, monto: 0 }); // reset
    }
  };


const presupuesto = useMemo<PresupuestoItem[]>(() => {
  const items: PresupuestoItem[] = [];

  selectedMethods.forEach((m) => {
    const base = subtotal; 
    let garantiasExtra = 0;

    GARANTIAS.forEach((g) => {
      if (garantias[g.id]) {
        garantiasExtra += base * g.porcentaje;
      }
    });

    const totalBase = base + garantiasExtra; 
    const totalFinal = totalBase * (1 + m.recargo); 
    items.push({
      nombre: m.name,
      cuotas: m.cuotas,
      montoCuota: totalFinal / m.cuotas,
      total: totalFinal,
    });
  });

  manualList.forEach((m) => {
    items.push({
      nombre: m.nombre,
      cuotas: m.cuotas,
      montoCuota: m.monto,
      total: m.monto * m.cuotas,
    });
  });

  return items;
}, [subtotal, garantias, selectedMethods, manualList]);


  useEffect(() => {
    const loadMethods = async () => {
      try {
        const payments = await paymentService.getPayments();

        const mapped = payments.map((p: any) => ({
          id: String(p.id),
          name: p.description || p.method,
          cuotas: Number(p.installments) || 1,
          recargo: Number(p.amount) || 0,
        }));
        setAvailableMethods(mapped);
      } catch (err) {
        console.error("Error cargando métodos:", err);
      }
    };

    loadMethods();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Productos */}
      <div className="border border-black rounded p-3 overflow-y-auto max-h-60">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No hay productos en el presupuesto.
          </p>
        ) : (
          <CartProducts />
        )}
      </div>

      {/* Métodos de pago */}
      <div className="grid grid-cols-2 gap-4">
          <PaymentSelector
            availableMethods={availableMethods}
            selected={selected}
            toggleMethod={toggleMethod}
          />

        <div className="border border-black rounded p-3">
          <h3 className="font-semibold mb-2">Resumen</h3>
          <p className="text-sm">
            Subtotal: <strong>${subtotal.toFixed(2)}</strong>
          </p>
          <p className="text-sm mt-2">
            Opciones seleccionadas: {selectedMethods.length + manualList.length}
          </p>
                      {/* Garantías */}
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
                    <span>{g.label} (+{(g.porcentaje * 100).toFixed(1)}%)</span>
                  </label>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* Ingreso manual */}
      <div className="border border-black rounded p-3">
        <h3 className="font-semibold mb-2">Ingreso manual</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm">Nombre</label>
            <input
              type="text"
              value={manualValues.nombre}
              onChange={(e) =>
                setManualValues({ ...manualValues, nombre: e.target.value })
              }
              className="border px-2 py-1 rounded w-48"
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
              className="border px-2 py-1 rounded w-20 text-center"
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
              className="border px-2 py-1 rounded w-28 text-center"
            />
          </div>
          <button
            onClick={addManual}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Tablas de métodos seleccionados */}
      {selectedMethods.map((m) => (
        <div key={m.id} className="border border-black rounded p-3">
          <h3 className="font-medium mb-2">{m.name}</h3>
          <table className="table-auto w-full text-sm text-center border border-black">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black">Cuotas</th>
                <th className="border border-black">Monto cuota</th>
                <th className="border border-black">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black">{m.cuotas}</td>
                <td className="border border-black">
                  ${((subtotal * (1 + m.recargo)) / m.cuotas).toFixed(2)}
                </td>
                <td className="border border-black">
                  ${(subtotal * (1 + m.recargo)).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* Tablas manuales */}
      {manualList.length > 0 && (
        <div className="border border-black rounded p-3">
          <h3 className="font-medium mb-2">Ingresos manuales</h3>
          <table className="table-auto w-full text-sm text-center border border-black">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black">Forma de pago</th>
                <th className="border border-black">Cuotas</th>
                <th className="border border-black">Monto cuota</th>
                <th className="border border-black">Total</th>
              </tr>
            </thead>
            <tbody>
              {manualList.map((m, i) => (
                <tr key={i}>
                  <td className="border border-black">{m.nombre}</td>
                  <td className="border border-black">{m.cuotas}</td>
                  <td className="border border-black">${m.monto.toFixed(2)}</td>
                  <td className="border border-black">${(m.cuotas * m.monto).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumen final + PDF */}
      {presupuesto.length > 0 && (
        <>
          <div className="rounded p-3 border border-black">
            <h3 className="font-bold mb-2">Resumen del presupuesto</h3>
            <table className="table-auto w-full text-sm text-center border border-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black">Forma de pago</th>
                  <th className="border border-black">Cuotas</th>
                  <th className="border border-black">Monto cuota</th>
                  <th className="border border-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {presupuesto.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border border-black">{p.nombre}</td>
                    <td className="border border-black">{p.cuotas}</td>
                    <td className="border border-black">${p.montoCuota.toFixed(2)}</td>
                    <td className="border border-black">${p.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Generar PDF */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                generarPDF(
                  items.map((it) => ({
                    detalle: it.product.detalle,
                    precio: it.product.precio,
                    qty: it.qty,
                  })),
                  presupuesto
                )
              }
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
            >
              Generar PDF
            </button>
          </div>
        </>
      )}
    </div>
  );

};

export default CartPage;
