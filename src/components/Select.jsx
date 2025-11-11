

export default function Select({ filtroEstado, setFiltroEstado, children }) {
    return (
        <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
            {children}
        </select>
    );
}