// ProductUploader.tsx
import React from "react";
import * as XLSX from "xlsx";
import { productService } from "../services/api";

type BulkProductInput = {
  id: number;                    
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string | null;
};

const ProductUploader: React.FC = () => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { raw: false });

        const products: BulkProductInput[] = jsonData
          .map((row) => {
            const norm = Object.fromEntries(
              Object.entries(row).map(([k, v]) => [String(k).trim().toLowerCase(), v])
            );

            const price = Number(String(norm["precio"] ?? "0").replace(",", "."));
            const stock = Number(String(norm["stock1_a"] ?? "0").replace(",", "."));
            const stockCentro = Number(String(norm["stock1_b"] ?? "0").replace(",", "."));
            const stockDeposito = Number(String(norm["stock5"] ?? "0").replace(",", "."));

            return {
              id: Number(norm["codigo"] ?? 0), 
              name: String(norm["detalle"] ?? "").trim(),
              description: String(norm["detalle"] ?? "").trim(),
              price: Number.isFinite(price) ? price : 0,
              stock: Number.isFinite(stock) ? stock : 0,
              stock_centro: Number.isFinite(stockCentro) ? stockCentro : 0,   
              stock_deposito: Number.isFinite(stockDeposito) ? stockDeposito : 0, 
              category: String(norm["rubro"] ?? "General").trim() || "",
              imageUrl: norm["imagen"] ? String(norm["imagen"]) : null,
            };
          })
        
          .filter((p) => p.id && p.name && p.price > 0 && p.stock >= 0);

        if (products.length === 0) {
          alert("No se encontraron productos válidos en el archivo.");
          return;
        }

        const resp = await productService.bulkUpload(products);
        alert(`Se cargaron/actualizaron ${resp.successCount} productos. Errores: ${resp.errorCount}`);
      } catch (error) {
        console.error(error);
        alert("Error al procesar el archivo Excel. Verifica el formato y los datos.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-700 text-center p-5">Actualizar productos desde Excel</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default ProductUploader;
