import React, { useEffect, useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { paymentService, budgetService } from "../services/api";
import { generarPDF } from "../utils/pdfGenerator";
import { formatCurrency } from "../utils/formatCurrency";

import CartProducts from "./CartPage/CartProducts";
import PaymentSelector from "./CartPage/PaymentSelector";
import SelectSeller from "./CartPage/SelectSeller";
import GarantiasSelector from "./CartPage/GarantiaSelector";
import AdvancePayment from "./CartPage/AdvancePayment";
import PresupuestoTable from "./CartPage/BudgetTable";
import PresupuestoPorProductoTable from "./CartPage/BudgetForProduct";
import usePresupuesto, {
  type PresupuestoItem,
  type PresupuestoPorProducto,
} from "./CartPage/useBudget";

export type PaymentMethod = {
  id: string;
  name: string;
  cuotas: number;
  recargo: number;
  metodo: string;
};

const CartPage: React.FC = () => {
  const { items, subtotal } = useCart();
  const [garantias, setGarantias] = useState<Record<string, boolean>>({});
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [modoIndividual, setModoIndividual] = useState(false);
  const [openSellerModal, setOpenSellerModal] = useState(false);
  const [entrega, setEntrega] = useState(0);

  // --- Métodos seleccionados ---
  const selectedMethods = useMemo(
    () => availableMethods.filter((m) => selected[m.id]),
    [availableMethods, selected]
  );

  // --- Calcular presupuesto ---
  const presupuesto = usePresupuesto({
    modoIndividual,
    subtotal,
    items,
    garantias,
    selectedMethods,
    entrega,
  });

  // --- Cargar métodos de pago ---
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

  const handleGenerateBudget = async ({
    seller,
    cliente,
    observaciones,
  }: {
    seller: { id: number; nombre: string; apellido: string };
    cliente?: string;
    observaciones?: string;
  }) => {
    try {
      if (items.length === 0) {
        alert("No hay productos en el presupuesto.");
        return;
      }

      if (selectedMethods.length === 0) {
        alert("Debes seleccionar al menos una forma de pago.");
        return;
      }

      const payload = {
        vendedorId: seller.id,
        payments: selectedMethods.map((m) => Number(m.id)),
        items: items.map((it) => {
          const product = it.product as any;
          const productoId = Number(product.id ?? product.codigo ?? 0);

          return {
            productoId,
            cantidad: it.qty,
          };
        }),
      };

      const resp = await budgetService.createBudget(payload);

      if (!resp.success || !resp.data?.id) {
        throw new Error("Error al crear el presupuesto en la base de datos.");
      }

      const presupuestoId = resp.data.id;

      // --- Generar PDF ---
      await generarPDF(
        items.map((it) => ({
          detalle: it.product.detalle,
          precio: it.product.precio,
          qty: it.qty,
        })),
        presupuesto,
        { nombre: seller.nombre, apellido: seller.apellido },
        cliente,
        observaciones,
        entrega,
        presupuestoId
      );
    } catch (err) {

      console.error("Error creando presupuesto:", err);
      alert("Ocurrió un error al generar el presupuesto");
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-gray-200">
      {/* --- Productos --- */}
      <div className="border border-gray-700 bg-gray-800 rounded p-3 overflow-y-auto max-h-60 shadow">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            No hay productos en el presupuesto.
          </p>
        ) : (
          <CartProducts />
        )}
      </div>

      {/* --- Métodos + Resumen --- */}
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
            Subtotal:{" "}
            <strong className="text-green-400">
              ${formatCurrency(subtotal)}
            </strong>
          </p>
          <p className="text-sm mt-2">
            Formas de pago seleccionadas:{" "}
            <span className="text-blue-400">{selectedMethods.length}</span>
          </p>
          <GarantiasSelector garantias={garantias} setGarantias={setGarantias} />
        </div>
      </div>

      {/* --- Entrega --- */}
      <AdvancePayment entrega={entrega} setEntrega={setEntrega} />

      {/* --- Tablas de resumen --- */}
      {!modoIndividual && (presupuesto as PresupuestoItem[]).length > 0 && (
        <PresupuestoTable data={presupuesto as PresupuestoItem[]} />
      )}
      {modoIndividual && (presupuesto as PresupuestoPorProducto[]).length > 0 && (
        <PresupuestoPorProductoTable
          data={presupuesto as PresupuestoPorProducto[]}
        />
      )}

      {/* --- Botón generar PDF --- */}
      {items.length > 0 &&
        Array.isArray(presupuesto) &&
        presupuesto.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setOpenSellerModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow transition"
            >
              Generar PDF
            </button>
          </div>
        )}

      {/* --- Modal seleccionar vendedor --- */}
      <SelectSeller
        open={openSellerModal}
        onClose={() => setOpenSellerModal(false)}
        onSelect={handleGenerateBudget}
      />
    </div>
  );
};

export default CartPage;
