export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Activa':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Suspendida':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'Mora':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'Inactiva':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    default:
      return '';
  }
};

export const listaFiltrada = (criterio, listaMatriculas) =>
  listaMatriculas.filter((matricula) =>
    matricula.cod_matricula.toLowerCase().includes(criterio.toLowerCase()) ||
    matricula.predio?.propietario?.cc.toLowerCase().includes(criterio.toLowerCase())
  );

export const listaFiltradaFactura = (criterio, listaFacturas) =>
  listaFacturas.filter((f) =>
    f.cod_matricula.toLowerCase().includes(criterio.toLowerCase()) ||
    f.matricula?.predio?.propietario?.cc.toLowerCase().includes(criterio.toLowerCase())
  );
