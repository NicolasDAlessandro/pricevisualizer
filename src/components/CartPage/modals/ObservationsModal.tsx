import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (texto: string) => void;
}

const ObservationsModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [texto, setTexto] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 text-white rounded-lg shadow-md w-[500px] max-w-[90vw] p-4">
        <h3 className="text-lg font-semibold mb-3">Observaciones</h3>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Notas adicionales..."
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-700 rounded">Cancelar</button>
          <button
            onClick={() => {
              onSave(texto);
              onClose();
            }}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObservationsModal;
