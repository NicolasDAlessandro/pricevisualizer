// src/components/CartButton.tsx
import React from "react";
import { useCart } from '../context/CartContext'; 

interface Props {
  onOpen: () => void;
}

const CartButton: React.FC<Props> = ({ onOpen }) => {
  const { totalItems, subtotal } = useCart();

  return (
    <button
      onClick={onOpen}
      className="relative inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      title="Abrir carrito / presupuesto"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h13m-9-7v7m4-7v7" />
      </svg>
      <span>Carrito</span>
      <span className="ml-2 text-sm bg-white text-blue-600 rounded-full px-2 py-0.5 font-medium">{totalItems}</span>
      <span className="ml-2 text-sm opacity-80">${subtotal.toFixed(2)}</span>
    </button>
  );
};

export default CartButton;
