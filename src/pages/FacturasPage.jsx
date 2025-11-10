import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search } from "lucide-react";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('desc'); // 'desc' = más reciente primero, 'asc' = más antigua primero
  const [mostrarModalNueva, setMostrarModalNueva] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [matriculas, setMatriculas] = useState([]);
  const [busquedaMatricula, setBusquedaMatricula] = useState('');

  // Formulario de nueva factura individual
  const [formNueva, setFormNueva] = useState({
    cod_matricula: '',
    fecha_vencimiento: '',
    valor: '',
    url: ''
  });

  // Formulario de pago
  const [formPago, setFormPago] = useState({
    fecha_pago: new Date().toISOString().split('T')[0],
    metodo_pago: 'efectivo',
    valor: ''
  });

  useEffect(() => {
    const inicializar = async () => {
      await actualizarFacturasEnMora();
      await cargarFacturas();
      await cargarMatriculas();
    };
    inicializar();
  }, [filtroEstado]);

  const actualizarFacturasEnMora = async () => {
    try {
      const resultado = await api.post('/facturas/actualizar-mora');
      console.log('Facturas en mora actualizadas:', resultado);
    } catch (err) {
      if (err.message.includes('404') || err.message.includes('Failed to fetch')) {
        console.warn('Endpoint de mora no disponible. Usando actualización local temporal...');
        actualizarMoraLocal();
      } else {
        console.error('Error al actualizar facturas en mora:', err.message);
      }
    }
  };

  const actualizarMoraLocal = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    
    setFacturas(prevFacturas => 
      prevFacturas.map(factura => {
        if ((factura.estado === 'Pendiente' || factura.estado === 'Vencida') && 
            factura.fecha_vencimiento < fechaActual) {
          console.log(`Actualizando factura ${factura.id} a estado "en_mora" (local)`);
          return { ...factura, estado: 'en_mora' };
        }
        return factura;
      })
    );
  };

  // Función auxiliar para verificar si una factura puede recibir pagos
  const puedeRecibirPago = (estado) => {
    return estado === 'Pendiente' || estado === 'Vencida' || estado === 'en_mora';
  };

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = filtroEstado ? `/facturas?estado=${filtroEstado}` : '/facturas';
      const data = await api.get(endpoint);
      ordenarFacturas(data);
    } catch (err) {
      setError('Error al cargar las facturas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const ordenarFacturas = (facturasData) => {
    const facturasOrdenadas = [...facturasData].sort((a, b) => {
      const fechaA = new Date(a.fecha_creacion);
      const fechaB = new Date(b.fecha_creacion);

      if (ordenFecha === 'desc') {
        return fechaB - fechaA; 
      } else {
        return fechaA - fechaB; 
      }
    });
    setFacturas(facturasOrdenadas);
  };

  const cambiarOrdenFecha = () => {
    const nuevoOrden = ordenFecha === 'desc' ? 'asc' : 'desc';
    setOrdenFecha(nuevoOrden);
    ordenarFacturas(facturas);
  };

  const cargarMatriculas = async () => {
    try {
      const data = await api.get('/matriculas');
      setMatriculas(data);
    } catch (err) {
      console.error('Error al cargar matrículas:', err);
    }
  };

  const crearNuevaFactura = async (e) => {
    e.preventDefault();

    if (!formNueva.cod_matricula || !formNueva.fecha_vencimiento || !formNueva.valor) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setGuardando(true);

      await api.post('/facturas', {
        cod_matricula: formNueva.cod_matricula,
        fecha_vencimiento: formNueva.fecha_vencimiento,
        valor: parseFloat(formNueva.valor),
        url: formNueva.url || `facturas/${formNueva.cod_matricula}_${new Date().getTime()}.pdf`
      });

      alert('Factura creada exitosamente');
      setMostrarModalNueva(false);
      cargarFacturas();

      // Resetear formulario
      setFormNueva({
        cod_matricula: '',
        fecha_vencimiento: '',
        valor: '',
        url: ''
      });

    } catch (err) {
      alert('Error al crear factura: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const verDetalleFactura = async (id) => {
    try {
      setGuardando(true);
      const data = await api.get(`/facturas/${id}`);
      setFacturaSeleccionada(data);
      setMostrarModalDetalle(true);
    } catch (err) {
      alert('Error al cargar detalle: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const verFacturasPorMatricula = async (codigo) => {
    try {
      setLoading(true);
      const data = await api.get(`/facturas/matricula/${codigo}`);
      setFacturas(data);
    } catch (err) {
      alert('Error al cargar facturas de la matrícula: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoFactura = async (id, nuevoEstado) => {
    if (window.confirm(`¿Cambiar estado de la factura a "${nuevoEstado}"?`)) {
      try {
        await api.put(`/facturas/${id}/estado`, { estado: nuevoEstado });
        alert('Estado actualizado correctamente');
        cargarFacturas();
      } catch (err) {
        alert('Error al actualizar estado: ' + err.message);
      }
    }
  };

  const abrirModalPago = (factura) => {
    setFacturaSeleccionada(factura);
    setFormPago({
      fecha_pago: new Date().toISOString().split('T')[0],
      metodo_pago: 'efectivo',
      valor: factura.valor.toString()
    });
    setMostrarModalPago(true);
  };

  const registrarPago = async (e) => {
    e.preventDefault();

    if (!formPago.valor || parseFloat(formPago.valor) <= 0) {
      alert('Por favor ingrese un valor válido');
      return;
    }

    try {
      setGuardando(true);

      await api.post(`/facturas/${facturaSeleccionada.id}/pago`, {
        fecha_pago: formPago.fecha_pago,
        metodo_pago: formPago.metodo_pago,
        valor: parseFloat(formPago.valor)
      });

      alert('Pago registrado exitosamente');
      setMostrarModalPago(false);
      cargarFacturas();

      // Resetear formulario
      setFormPago({
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: 'efectivo',
        valor: ''
      });

    } catch (err) {
      alert('Error al registrar pago: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerColorEstado = (estado) => {
    const colores = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Pagada': 'bg-green-100 text-green-800',
      'Vencida': 'bg-red-100 text-red-800',
      'en_mora': 'bg-red-200 text-red-900'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando facturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Gestión de Facturas
        </h1>
        <button
          onClick={() => setMostrarModalNueva(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center gap-2"
        >
          <span>+</span>
          Nueva Factura
        </button>
      </div>
    <div>
      
       <div className="flex flex-row gap-2 w-full mb-4 ">
       <input
            type="text"
            placeholder="Buscar por matrícula..."
            value={busquedaMatricula}
            onChange={(e) => setBusquedaMatricula(e.target.value)}
            className="w-full h-12 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          
        </div>
    </div>
      {/* Filtros */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="text-sm font-medium text-gray-700">
            Filtrar por estado:
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagada">Pagada</option>
            <option value="Vencida">Vencida</option>
            <option value="en_mora">En Mora</option>
          </select>
          <button
              onClick={cargarFacturas}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          <button
              onClick={() => {
                setFiltroEstado('');
                setBusquedaMatricula('');
                cargarFacturas();
              }}
              className="ml-auto bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver Todas
            </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tabla de facturas */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {facturas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay facturas registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <button
                      onClick={cambiarOrdenFecha}
                      className="flex items-center gap-1 hover:text-blue-600 transition"
                      title={ordenFecha === 'desc' ? 'Click para ordenar: más antigua primero' : 'Click para ordenar: más reciente primero'}
                    >
                      Fecha Emisión
                      <span className="text-base">
                        {ordenFecha === 'desc' ? '↓' : '↑'}
                      </span>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {facturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{factura.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {factura.cod_matricula}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {factura.periodo_facturacion || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatearFecha(factura.fecha_creacion)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatearFecha(factura.fecha_vencimiento)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatearMoneda(factura.valor)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${obtenerColorEstado(factura.estado)}`}>
                        {factura.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                      <button
                          onClick={() => verDetalleFactura(factura.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(factura.estado === 'Pendiente' || factura.estado === 'Vencida' || factura.estado === 'en_mora') && (
                           <button
                           onClick={() => abrirModalPago(factura)}
                           className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                           title="Registrar pago"
                         >
                           <DollarSign className="w-4 h-4" />
                         </button>
                        )}
                        <button
                          onClick={() => verFacturasPorMatricula(factura.cod_matricula)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                          title="Ver facturas de esta matrícula"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {factura.url && (
                           <a
                           href={factura.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                           title="Descargar PDF"
                         >
                           <Download className="w-4 h-4" />
                         </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detalle de Factura */}
      {mostrarModalDetalle && facturaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="pointer-events-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Detalle de Factura #{facturaSeleccionada.id}
              </h2>
              <button
                onClick={() => setMostrarModalDetalle(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Contenido del Modal */}
            <div className="overflow-y-auto p-6">

            <div className="space-y-4">
              {/* Información de la factura */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Información de la Factura</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Matrícula:</span>
                    <p className="font-medium">{facturaSeleccionada.cod_matricula}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <p>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${obtenerColorEstado(facturaSeleccionada.estado)}`}>
                        {facturaSeleccionada.estado}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha Emisión:</span>
                    <p className="font-medium">{formatearFecha(facturaSeleccionada.fecha_creacion)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha Vencimiento:</span>
                    <p className="font-medium">{formatearFecha(facturaSeleccionada.fecha_vencimiento)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Periodo:</span>
                    <p className="font-medium">{facturaSeleccionada.periodo_facturacion || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Valor:</span>
                    <p className="font-bold text-lg">{formatearMoneda(facturaSeleccionada.valor)}</p>
                  </div>
                </div>
                {facturaSeleccionada.observaciones && (
                  <div className="mt-3">
                    <span className="text-gray-600">Observaciones:</span>
                    <p className="text-sm text-gray-700 mt-1">{facturaSeleccionada.observaciones}</p>
                  </div>
                )}
              </div>

              {/* Información del predio y propietario */}
              {facturaSeleccionada.matricula && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Información del Predio</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-gray-600">Dirección:</span>
                      <p className="font-medium">{facturaSeleccionada.matricula.predio?.direccion || '-'}</p>
                    </div>
                    {facturaSeleccionada.matricula.predio?.propietario && (
                      <>
                        <div>
                          <span className="text-gray-600">Propietario:</span>
                          <p className="font-medium">
                            {facturaSeleccionada.matricula.predio.propietario.nombre} {facturaSeleccionada.matricula.predio.propietario.apellido}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">CC:</span>
                          <p className="font-medium">{facturaSeleccionada.matricula.predio.propietario.cc}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Pagos realizados */}
              {facturaSeleccionada.pagos && facturaSeleccionada.pagos.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Pagos Realizados</h3>
                  <div className="space-y-2">
                    {facturaSeleccionada.pagos.map((pago, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                        <div>
                          <p className="font-medium">{formatearFecha(pago.fecha_pago)}</p>
                          <p className="text-gray-600 text-xs">{pago.metodo_pago}</p>
                        </div>
                        <p className="font-bold text-green-700">{formatearMoneda(pago.valor)}</p>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total Pagado:</span>
                        <span className="text-green-700">
                          {formatearMoneda(facturaSeleccionada.pagos.reduce((sum, p) => sum + parseFloat(p.valor), 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            </div>
            
            {/* Footer del Modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setMostrarModalDetalle(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cerrar
              </button>
              {(facturaSeleccionada.estado === 'Pendiente' || facturaSeleccionada.estado === 'Vencida' || facturaSeleccionada.estado === 'en_mora') && (
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    abrirModalPago(facturaSeleccionada);
                  }}
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Registrar Pago
                </button>
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Pago */}
      {mostrarModalPago && facturaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="pointer-events-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Registrar Pago - Factura #{facturaSeleccionada.id}
              </h2>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Matrícula:</span> {facturaSeleccionada.cod_matricula}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Valor Factura:</span> {formatearMoneda(facturaSeleccionada.valor)}
                </p>
              </div>

              <form onSubmit={registrarPago} id="formPago">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Pago *
                  </label>
                  <input
                    type="date"
                    value={formPago.fecha_pago}
                    onChange={(e) => setFormPago({ ...formPago, fecha_pago: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago *
                  </label>
                  <select
                    value={formPago.metodo_pago}
                    onChange={(e) => setFormPago({ ...formPago, metodo_pago: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor del Pago *
                  </label>
                  <input
                    type="number"
                    value={formPago.valor}
                    onChange={(e) => setFormPago({ ...formPago, valor: e.target.value })}
                    placeholder="50000"
                    min="0"
                    step="100"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puede ser un pago parcial o total
                  </p>
                </div>
              </div>
              </form>
            </div>

            {/* Footer del Modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={() => setMostrarModalPago(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="formPago"
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Registrar Pago'}
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Factura */}
      {mostrarModalNueva && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="pointer-events-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Nueva Factura
              </h2>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              <form onSubmit={crearNuevaFactura} id="formNuevaFactura">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matrícula *
                  </label>
                  <select
                    value={formNueva.cod_matricula}
                    onChange={(e) => setFormNueva({ ...formNueva, cod_matricula: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Seleccione una matrícula</option>
                    {matriculas.map((mat) => (
                      <option key={mat.cod_matricula} value={mat.cod_matricula}>
                        {mat.cod_matricula} - {mat.predio?.direccion || 'Sin dirección'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    value={formNueva.fecha_vencimiento}
                    onChange={(e) => setFormNueva({ ...formNueva, fecha_vencimiento: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor *
                  </label>
                  <input
                    type="number"
                    value={formNueva.valor}
                    onChange={(e) => setFormNueva({ ...formNueva, valor: e.target.value })}
                    placeholder="50000"
                    min="0"
                    step="100"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del PDF (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formNueva.url}
                    onChange={(e) => setFormNueva({ ...formNueva, url: e.target.value })}
                    placeholder="facturas/factura_001.pdf"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si se deja vacío, se generará automáticamente
                  </p>
                </div>
              </div>
              </form>
            </div>

            {/* Footer del Modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={() => setMostrarModalNueva(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="formNuevaFactura"
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Crear Factura'}
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
