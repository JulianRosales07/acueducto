import Buscador from '../components/ComponetesGrupo6/Buscador'
import { useState, useEffect } from 'react';
import { MapPin, Calendar, Home, Search, Eye, Edit2, FileText } from "lucide-react";
import { getMatriculas } from '../services/matriculasService'
import CardMatricula from "../components/ComponentesGrupo5/CardMatriculas";
import FormMatricula from '../components/ComponentesGrupo5/FormMatricula';
import { toast } from 'react-hot-toast';

export default function MatriculasPage() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState(null);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);



  const cargarMatriculas = async () => {
    try {
      const datos = await getMatriculas();
      setLista(datos);
    } catch (error) {
      toast.error('Error al cargar las matrículas');
    }
  };

  useEffect(() => {
    cargarMatriculas();
  }, []);



  // Filtrar la lista basándose en el término de búsqueda
  const listaFiltrada = lista.filter((m) => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return true; 

    return (
      (m.cod_matricula && m.cod_matricula.toLowerCase().includes(termino)) ||
      (m.predio?.propietario?.cc && m.predio.propietario.cc.toLowerCase().includes(termino)) ||
      (m.predio?.propietario?.nombre && m.predio.propietario.nombre.toLowerCase().includes(termino))
    );
  });

  // Paginación
  const totalPaginas = Math.ceil(listaFiltrada.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const listaPaginada = listaFiltrada.slice(indiceInicio, indiceFin);

  // Resetear a página 1 cuando cambia la búsqueda o items por página
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, itemsPorPagina]);



  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Matrículas
          </h1>
          <p className="text-gray-600 mt-1">Gestiona las matrículas de los predios</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105">
          <FileText className="w-5 h-5" />
          <span className="font-semibold">Nueva Matrícula</span>
        </button>
      </div>

      {/* Modal de nueva matrícula */}
      {showForm && (
        <FormMatricula
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            cargarMatriculas();
            setShowForm(false);
          }}
        />
      )}



      {/* Modal de detalles de matrícula */}
      {selectedMatricula && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Detalles de Matrícula</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Matrícula
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.cod_matricula}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.estado}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.fecha}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Usuario
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.tipo_usuario}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarifa
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.tarifa}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Predio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.predio.direccion}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Predio
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.predio.tipo}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Propietario
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.predio.propietario.nombre}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cédula del Propietario
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedMatricula.predio.propietario.cc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedMatricula(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Barra de búsqueda y filtros */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por código de matrícula o cédula del propietario..."
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="text-gray-600">Mostrando </span>
              <span className="font-bold text-blue-600">{Math.min(indiceInicio + 1, listaFiltrada.length)}-{Math.min(indiceFin, listaFiltrada.length)}</span>
              <span className="text-gray-600"> de </span>
              <span className="font-bold text-blue-600">{listaFiltrada.length}</span>
            </div>
            <select
              value={itemsPorPagina}
              onChange={(e) => setItemsPorPagina(Number(e.target.value))}
              className="text-sm bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        {listaFiltrada.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron matrículas
            </h2>
            <p className="text-gray-500">
              No hay matrículas asociadas a la cédula o número ingresado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Propietario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Dirección del Predio</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {listaPaginada.map((m, index) => (
                  <tr key={m.cod_matricula} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-bold text-blue-600">{m.cod_matricula}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {m.predio?.propietario?.nombre?.charAt(0) || '?'}{m.predio?.propietario?.apellido?.charAt(0) || ''}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {m.predio?.propietario?.nombre || 'Sin'} {m.predio?.propietario?.apellido || 'propietario'}
                          </p>
                          <p className="text-xs text-gray-500">CC: {m.predio?.propietario?.cc || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{m.predio.direccion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                        m.estado === 'Activa' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                        m.estado === 'Inactiva' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' :
                        'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                      }`}>
                        {m.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{m.fecha}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatricula(m);
                          }}
                          className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-all hover:scale-110"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {listaFiltrada.length > 0 && totalPaginas > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Página <span className="font-bold text-blue-600">{paginaActual}</span> de <span className="font-bold text-blue-600">{totalPaginas}</span>
              </span>
            </div>
            <button
              onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
