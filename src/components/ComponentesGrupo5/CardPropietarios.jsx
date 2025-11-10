const CardPropietarios = ({
  cc,
  nombre,
  apellido,
  telefono,
  correo,
  onClick,
  propietario
}) => {
  return (
    <div
      className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-purple-900">{nombre} {apellido}</h2>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
          CC: {cc}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-700 mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{nombre} {apellido}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{telefono}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{correo}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 border-t pt-3">
        <p className="text-xs text-purple-600 font-medium">Haz clic para ver detalles completos</p>
      </div>
    </div>
  );
};

export default CardPropietarios;
