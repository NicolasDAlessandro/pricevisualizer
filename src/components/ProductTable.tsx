import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { productService } from "../services/api";
import type { ProductDto } from "../types/Api.php";
import SearchBar from "./SearchBar";
import PaymentOptions from "./PaymentOptions";
import Toast from "./Toast";

const ProductTable: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { add } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll();
      setAllProducts(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allProducts;
    const q = searchQuery.toLowerCase();
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  }, [allProducts, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const handleAgregar = (product: ProductDto) => {
    add({
      codigo: parseInt(product.id ?? "0") || 0,
      detalle: product.name,
      stock: product.stock,
      precio: product.price,
    });
    setToastMessage(`Producto "${product.name}" agregado al carrito ✅`);
  };

  const toggleExpand = (id?: string) => {
    if (!id) return;
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={loadProducts}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 relative">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
      />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-500 border-gray-300">
          <thead className="text-xs text-white uppercase bg-blue-800 sticky top-0 shadow text-center">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod, idx) => (
                <React.Fragment key={`${prod.id ?? idx}`}>
                  <tr
                    onClick={() => toggleExpand(prod.id)}
                    className={`cursor-pointer ${
                      idx % 2 === 0
                        ? "bg-white border-b hover:bg-gray-50"
                        : "bg-gray-50 border-b hover:bg-gray-100"
                    }`}
                  >
                    <td className="px-6 py-4 text-center">{prod.id}</td>
                    <td className="px-6 py-4">{prod.name}</td>
                    <td className="px-6 py-4 text-center">{prod.stock}</td>
                    <td className="px-6 py-4 text-center">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">{prod.category}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgregar(prod);
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>

                  {expandedRow === prod.id && (
                    <tr className="bg-blue-50">
                      <td colSpan={6} className="px-6 py-4">
                        <PaymentOptions price={prod.price} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
