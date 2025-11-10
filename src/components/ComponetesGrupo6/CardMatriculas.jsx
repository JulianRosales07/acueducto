
const CardMatricula =(
    {
  codigo,
  estado,
  direccion,
  fecha,
  tipo,
  onClick,
}
) => {
    return (
        <>
        <div
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-blue-900">{codigo}</h2>
        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
          {estado}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-700 mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6z" />
          </svg>
          <span>{direccion}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Creada: {fecha}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 10h18M3 6h18M3 14h18M3 18h18" />
          </svg>
          <span>{tipo}</span>
        </div>
      </div>

      <p className="text-xs text-blue-600 font-medium">Toca para ver detalles completos</p>
    </div>

        </>
    );
}

export default CardMatricula;