import Buscador from '../components/ComponetesGrupo6/Buscador'
import { useState, useEffect } from 'react';
import { MapPin, Calendar, Home, Search, Eye, Edit2, Building2, User } from "lucide-react";
import { getPredios, deletePredio } from '../services/prediosService'
import CardPredios from "../components/ComponentesGrupo5/CardPredios";
import FormPredio from '../components/ComponentesGrupo5/FormPredio';
import { toast } from 'react-hot-toast';

export default function PrediosPage() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPredio, setSelectedPredio] = useState(null);
  const [editingPredio, setEditingPredio] = useState(null);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);

  const cargarPredios = async () => {
    try {
      const datos = await getPredios();
      setLista(datos);
    } catch (error) {
      toast.error('Error al cargar los predios');
    }
  };

  useEffect(() => {
    cargarPredios();
  }, []);

  // Filtrar la lista basándose en el término de búsqueda
  const listaFiltrada = lista.filter((p) => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return true; 

    return (
      p.direccion.toLowerCase().includes(termino) ||
      (p.propietario?.cc && p.propietario.cc.toLowerCase().includes(termino)) ||
      (p.propietario?.nombre && p.propietario.nombre.toLowerCase().includes(termino)) ||
      p.telefono.toLowerCase().includes(termino) ||
      p.correo.toLowerCase().includes(termino)
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
            Predios
          </h1>
          <p className="text-gray-600 mt-1">Gestiona los predios y sus propietarios</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105">
          <Building2 className="w-5 h-5" />
          <span className="font-semibold">Nuevo Predio</span>
        </button>
      </div>

      {/* Modal de nuevo predio */}
      {showForm && (
        <FormPredio
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            cargarPredios();
            setShowForm(false);
          }}
        />
      )}

      {/* Modal de editar predio */}
      {editingPredio && (
        <FormPredio
          predio={editingPredio}
          onClose={() => setEditingPredio(null)}
          onSuccess={() => {
            cargarPredios();
            setEditingPredio(null);
          }}
        />
      )}

      {/* Modal de detalles de predio */}
      {selectedPredio && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Detalles del Predio</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID del Predio
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Predio
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.tipo}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Registro
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.fecha_registro}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Predio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.direccion}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.telefono}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.correo}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Propietario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.propietario?.nombre || 'Sin propietario'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cédula
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedPredio.propietario?.cc || 'Sin cédula'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => {
                  setEditingPredio(selectedPredio);
                  setSelectedPredio(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => setSelectedPredio(null)}
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
              placeholder="Buscar por dirección, propietario o cédula..."
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
              No se encontraron predios
            </h2>
            <p className="text-gray-500">
              No hay predios registrados con los criterios de búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Propietario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fecha Registro</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {listaPaginada.map((p, index) => (
                  <tr key={p.id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">#{p.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{p.direccion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{p.propietario?.nombre || 'Sin propietario'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                        p.tipo === 'Residencial' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' :
                        p.tipo === 'Comercial' ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' :
                        p.tipo === 'Industrial' ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                        'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      }`}>
                        {p.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{p.telefono}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{p.fecha_registro}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPredio(p);
                          }}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all hover:scale-110"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPredio(p);
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
