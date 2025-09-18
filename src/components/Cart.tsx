import React, { useMemo, useState, useEffect } from "react";
import type { PaymentMethod } from "./PaymentOptions";
import { useCart } from "../context/CartContext";
import { paymentService } from "../services/api";
import { generarPDF } from "../utils/pdfGenerator";
import CartProducts from "./CartPage/CartProducts";
import PaymentSelector from "./CartPage/PaymentSelector";
import SelectSeller from "./SelectSeller";

type ManualPayment = { nombre: string; cuotas: number; monto: number };
type PresupuestoItem = {
  nombre: string;
  cuotas: number;
  montoCuota: number;
  total: number;
};
type PresupuestoPorProducto = {
  producto: string;
  opciones: PresupuestoItem[];
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
  const [modoIndividual, setModoIndividual] = useState(false);
  const [openSellerModal, setOpenSellerModal] = useState(false);
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

  // --- cálculo de presupuesto
  const presupuesto = useMemo(() => {
    if (!modoIndividual) {
      // --- Modo TOTAL
      const items: PresupuestoItem[] = [];

      selectedMethods.forEach((m) => {
        console.log("Calculando método:", m.metodo);
        const base = subtotal;
        let garantiasExtra = 0;

        GARANTIAS.forEach((g) => {
          if (garantias[g.id]) garantiasExtra += base * g.porcentaje;
        });

        const totalBase = base + garantiasExtra;
        const totalFinal = m.metodo == "tarjeta" ? totalBase * (1 + m.recargo) : totalBase * (1 - m.recargo);

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
    } else {
      // --- Modo INDIVIDUAL
      const result: PresupuestoPorProducto[] = [];
      
      items.forEach((it) => {
        const productoTotal = it.product.precio * it.qty;
        const opciones: PresupuestoItem[] = [];

        selectedMethods.forEach((m) => {
          console.log("Calculando método:", m.metodo);
          let garantiasExtra = 0;
          GARANTIAS.forEach((g) => {
            if (garantias[g.id]) garantiasExtra += productoTotal * g.porcentaje;
          });

          const totalBase = productoTotal + garantiasExtra;
          const totalFinal = m.metodo == "tarjeta" ? totalBase * (1 + m.recargo) : totalBase * (1 - m.recargo);

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

  // --- cargar métodos de pago
  useEffect(() => {
    const loadMethods = async () => {
      try {
        const payments = await paymentService.getPayments();

        const mapped = payments.map((p: any) => ({
          id: String(p.id),
          name: p.description,
          cuotas: Number(p.installments) || 1,
          recargo: Number(p.amount) || 0,
          metodo : p.method,
        }));
        setAvailableMethods(mapped);
      } catch (err) {
        console.error("Error cargando métodos:", err);
      }
    };

    loadMethods();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-gray-200">
      {/* Productos */}
      <div className="border border-gray-700 bg-gray-800 rounded p-3 overflow-y-auto max-h-60 shadow">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
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
        <div className="border border-gray-700 bg-gray-800 rounded p-3 h-56 flex flex-col shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-400">Resumen</h3>
            <button
              onClick={() => setModoIndividual(!modoIndividual)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition"
            >
              {modoIndividual ? "Ver Precio Total" : "Ver Precio Individual"}
            </button>
          </div>

          <p className="text-sm">
            Subtotal:{" "}
            <strong className="text-green-400">${subtotal.toFixed(2)}</strong>
          </p>
          <p className="text-sm mt-2">
            Opciones seleccionadas:{" "}
            <span className="text-blue-400">
              {selectedMethods.length + manualList.length}
            </span>
          </p>

          {/* Garantías */}
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
        </div>
      </div>

      {/* Ingreso manual */}
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

      {/* Resumen final */}
      {!modoIndividual && (presupuesto as PresupuestoItem[]).length > 0 && (
        <>
          <div className="rounded p-3 border border-gray-700 bg-gray-800 shadow">
            <h3 className="font-bold mb-2 text-green-400">
              Resumen del presupuesto
            </h3>
            <table className="table-auto w-full text-sm text-center border border-gray-700 rounded overflow-hidden">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="border border-gray-600 px-2 py-1">Forma de pago</th>
                  <th className="border border-gray-600 px-2 py-1">Cuotas</th>
                  <th className="border border-gray-600 px-2 py-1">Monto cuota</th>
                  <th className="border border-gray-600 px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {(presupuesto as PresupuestoItem[]).map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-700 transition border-b border-gray-700"
                  >
                    <td className="px-2 py-1">{p.nombre}</td>
                    <td className="px-2 py-1">{p.cuotas}</td>
                    <td className="px-2 py-1 text-blue-400">
                      ${p.montoCuota.toFixed(2)}
                    </td>
                    <td className="px-2 py-1 text-green-400">
                      ${p.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Resumen individual */}
      {modoIndividual && (presupuesto as PresupuestoPorProducto[]).length > 0 && (
        <>
          {(presupuesto as PresupuestoPorProducto[]).map((grupo, idx) => (
            <div
              key={idx}
              className="rounded p-3 border border-gray-700 bg-gray-800 mb-4 shadow"
            >
              <h3 className="font-bold mb-2 text-blue-400">{grupo.producto}</h3>
              <table className="table-auto w-full text-sm text-center border border-gray-700 rounded overflow-hidden">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="border border-gray-600 px-2 py-1">Forma de pago</th>
                    <th className="border border-gray-600 px-2 py-1">Cuotas</th>
                    <th className="border border-gray-600 px-2 py-1">Monto cuota</th>
                    <th className="border border-gray-600 px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {grupo.opciones.map((p, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-700 transition border-b border-gray-700"
                    >
                      <td className="px-2 py-1">{p.nombre}</td>
                      <td className="px-2 py-1">{p.cuotas}</td>
                      <td className="px-2 py-1 text-blue-400">
                        ${p.montoCuota.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-green-400">
                        ${p.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}

      {/* Generar PDF */}
      {Array.isArray(presupuesto) && presupuesto.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setOpenSellerModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow transition"
          >
            Generar PDF
          </button>
        </div>
      )}

      <SelectSeller
        open={openSellerModal}
        onClose={() => setOpenSellerModal(false)}
        onSelect={(seller) => {
          generarPDF(
            items.map((it) => ({
              detalle: it.product.detalle,
              precio: it.product.precio,
              qty: it.qty,
            })),
            presupuesto,
            seller
          );
        }}
      />
    </div>
  );
};

export default CartPage;
