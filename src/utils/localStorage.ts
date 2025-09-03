import type { Product } from "../types/Product";

const STORAGE_KEY = "productos";

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearProducts = () => {
  localStorage.removeItem(STORAGE_KEY);
};
