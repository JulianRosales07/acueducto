import { Search } from "lucide-react";

// Componente de búsqueda de facturas por matrícula o cédula
export default function BusquedaFacturas({ busqueda, setBusqueda }) {
  
    const handleChange = (e) => {
    setBusqueda(e.target.value);
    };

  return (
    <div className="flex w-1/3 ml-auto flex-col">
      <div className="flex h-12 text-sm text-gray-700 border border-blue-300 rounded-lg shadow-sm placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-blue-500 transition">
        <div className="text-blue-700 px-3 py-3">
          <Search />
        </div>
        <input
          className="w-full pl-2 h-12 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none transition"
          type="text"
          value={busqueda}
          onChange={handleChange}
          placeholder="Buscar facturas"
        />
      </div>
    </div>
  );
}
