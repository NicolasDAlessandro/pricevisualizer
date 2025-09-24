// CartPage/index.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { paymentService } from "../services/api";
import { generarPDF } from "../utils/pdfGenerator";
import { formatCurrency } from "../utils/formatCurrency";

import CartProducts from "./CartPage/CartProducts";
import PaymentSelector from "./CartPage/PaymentSelector";
import SelectSeller from "./CartPage/SelectSeller";
import GarantiasSelector from "./CartPage/GarantiaSelector";
import ManualPaymentForm from "./CartPage/ManualPayment";
import PresupuestoTable from "./CartPage/BudgetTable";
import PresupuestoPorProductoTable from "./CartPage/BudgetForProduct";
import usePresupuesto, {type ManualPayment, type PresupuestoItem, type PresupuestoPorProducto } from "./CartPage/useBudget";

import type { PaymentMethod } from "./PaymentOptions";

const CartPage: React.FC = () => {
  const { items, subtotal } = useCart();
  const [garantias, setGarantias] = useState<Record<string, boolean>>({});
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [modoIndividual, setModoIndividual] = useState(false);
  const [openSellerModal, setOpenSellerModal] = useState(false);
  const [manualList, setManualList] = useState<ManualPayment[]>([]);

  // selected methods
  const selectedMethods = useMemo(
    () => availableMethods.filter((m) => selected[m.id]),
    [availableMethods, selected]
  );

  // presupuesto calculado
  const presupuesto = usePresupuesto({
    modoIndividual,
    subtotal,
    items,
    garantias,
    selectedMethods,
    manualList,
  });

  // cargar métodos de pago
  useEffect(() => {
    const loadMethods = async () => {
      try {
        const payments = await paymentService.getPayments();
        const mapped = payments.map((p: any) => ({
          id: String(p.id),
          name: p.description,
          cuotas: Number(p.installments) || 1,
          recargo: Number(p.amount) || 0,
          metodo: p.method,
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

      {/* Métodos + Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <PaymentSelector
          availableMethods={availableMethods}
          selected={selected}
          toggleMethod={(id) =>
            setSelected((s) => ({ ...s, [id]: !s[id] }))
          }
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
            Subtotal: <strong className="text-green-400">${formatCurrency(subtotal)}</strong>
          </p>
          <p className="text-sm mt-2">
            Opciones seleccionadas:{" "}
            <span className="text-blue-400">{selectedMethods.length + manualList.length}</span>
          </p>
          <GarantiasSelector garantias={garantias} setGarantias={setGarantias} />
        </div>
      </div>

      {/* Ingreso manual */}
      <ManualPaymentForm manualList={manualList} setManualList={setManualList} />

      {/* Resumen Final */}
      {!modoIndividual && (presupuesto as PresupuestoItem[]).length > 0 && (
        <PresupuestoTable data={presupuesto as PresupuestoItem[]} />
      )}
      {modoIndividual && (presupuesto as PresupuestoPorProducto[]).length > 0 && (
        <PresupuestoPorProductoTable data={presupuesto as PresupuestoPorProducto[]} />
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
        onSelect={({ seller, cliente, observaciones }) => {
          generarPDF(
            items.map((it) => ({
              detalle: it.product.detalle,
              precio: it.product.precio,
              qty: it.qty,
            })),
            presupuesto,
            { nombre: seller.nombre, apellido: seller.apellido },
            cliente,
            observaciones
          );
        }}
      />
    </div>
  );
};

export default CartPage;
