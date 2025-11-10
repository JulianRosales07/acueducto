// components/SearchButton.tsx
import { Search } from "lucide-react";

export default function Button({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 h-12 text-white text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow hover:opacity-90 transition"
    >
      <Search className="w-4 h-4" />
      Buscar
    </button>
  );
}
