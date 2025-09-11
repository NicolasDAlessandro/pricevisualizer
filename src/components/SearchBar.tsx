import React from "react";

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchInput,
  setSearchInput,
  handleSubmit,
  handleClear,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mb-4 flex gap-2 items-center bg-gray-800 p-4 rounded-lg shadow"
    >
      <input
        type="text"
        placeholder="Buscar por detalle (Enter para buscar)"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="flex-1 border border-gray-600 bg-gray-900 rounded px-5 py-3 text-lg shadow-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
      >
        Buscar
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="px-6 py-3 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition shadow"
      >
        Limpiar
      </button>
    </form>

  );
};

export default SearchBar;
