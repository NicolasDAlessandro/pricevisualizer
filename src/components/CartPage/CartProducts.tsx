import React from "react";
import { useCart } from "../../context/CartContext";   

const CartProducts: React.FC = () => {
  const { items, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No hay productos en el presupuesto.
      </p>
    );
  }

  return (
    <table className="table-auto w-full text-sm text-center border border-black">
      <thead className="bg-gray-100 text-xs text-gray-600">
        <tr>
          <th className="border border-black">Producto</th>
          <th className="border border-black">Precio</th>
          <th className="border border-black">Cantidad</th>
          <th className="border border-black">Subtotal</th>
          <th className="border border-black"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr
            key={String(it.product.codigo)}
            className="border border-black"
          >
            <td className="py-2 border border-black">{it.product.detalle}</td>
            <td className="py-2 border border-black">
              ${it.product.precio.toFixed(2)}
            </td>
            <td className="py-2 border border-black-700">
              <input
                type="number"
                min={0}
                value={it.qty}
                onChange={(e) =>
                  setQty(it.product.codigo, Math.max(0, Number(e.target.value)))
                }
                className="w-16 bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </td>
            <td className="py-2 border border-black">
              ${(it.product.precio * it.qty).toFixed(2)}
            </td>
            <td className="py-2 border border-black">
              <button
                onClick={() => remove(it.product.codigo)}
                className="text-red-600 text-sm hover:underline"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CartProducts;
