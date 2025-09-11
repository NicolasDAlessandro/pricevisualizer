
import React, { useEffect, useState } from "react";
import { sellerService } from "../services/api";

interface Seller {
  id: number;
  nombre: string;
  apellido: string;
  numeroVendedor: number;
  activo: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (seller: Seller) => void;
}

const SelectSeller: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      sellerService.getAll().then(setSellers).catch(console.error);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="bg-gray-900 text-white rounded-lg shadow-md w-[800px] max-w-[90vw]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold">Seleccionar vendedor</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">✕</button>
            </div>

            {/* Tabla */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
            <table className="w-full text-lg text-center text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
                <thead className="text-sm text-white uppercase bg-blue-700">
                <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Apellido</th>
                    <th className="px-4 py-3">Seleccionar</th>
                </tr>
                </thead>
                <tbody>
                {sellers.map((s, idx) => (
                    <tr
                    key={s.id ?? idx}
                    className={`${
                        idx % 2 === 0
                        ? "bg-gray-800 border-b border-gray-700"
                        : "bg-gray-700 border-b border-gray-600"
                    } ${selectedId === s.id ? "bg-blue-900" : ""}`}
                    >
                    <td className="px-4 py-3 text-center">{s.nombre}</td>
                    <td className="px-4 py-3 text-center">{s.apellido}</td>
                    <td className="px-4 py-3 text-center">
                        <input
                        type="checkbox"
                        checked={selectedId === s.id}
                        onChange={() =>
                            setSelectedId(selectedId === s.id ? null : s.id)
                        }
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded">Cancelar</button>
            <button
                disabled={!selectedId}
                onClick={() => {
                const seller = sellers.find((s) => s.id === selectedId);
                if (seller) {
                    onSelect(seller);
                    onClose();
                }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                Confirmar
            </button>
            </div>
        </div>
    </div>
  );
};

export default SelectSeller;
