import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
import { Trash2, Search, ChevronDown, X } from "lucide-react";
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitudEstado,
  deleteSolicitud,
} from "../services/solicitudesService";
import { getMatriculas } from "../services/matriculasService";
import { getMantenimientos } from "../services/mantenimientosService";
import { getPredios } from "../services/prediosService";
import { getPropietarios } from "../services/propietariosService";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [predios, setPredios] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cc_propietario: "",
    id_predio: "",
    cod_matricula: "",
    id_mantenimiento: "",
    observaciones: "",
    prioridad: "Media",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [solicitudesData, matriculasData, mantenimientosData] = await Promise.all([
        getSolicitudes(),
        getMatriculas(),
        getMantenimientos(),
      ]);
      setSolicitudes(solicitudesData);
      setMatriculas(matriculasData);
      setMantenimientos(mantenimientosData);
      setError(null);
    } catch (err) {
      setError("Error al cargar datos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSolicitud(formData);
      await loadData();
      resetForm();
    } catch (err) {
      setError("Error al crear solicitud: " + err.message);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await updateSolicitudEstado(id, nuevoEstado);
      await loadData();
    } catch (err) {
      setError("Error al actualizar estado: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Está seguro de eliminar esta solicitud?")) return;
    try {
      await deleteSolicitud(id);
      await loadData();
    } catch (err) {
      setError("Error al eliminar: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      cod_matricula: "",
      id_mantenimiento: "",
      observaciones: "",
      prioridad: "Media",
    });
    setShowForm(false);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      Pendiente: "bg-yellow-100 text-yellow-800",
      "En Proceso": "bg-blue-100 text-blue-800",
      Completado: "bg-green-100 text-green-800",
      Cancelado: "bg-red-100 text-red-800",
    };
    return badges[estado] || "bg-gray-100 text-gray-800";
  };

  const getPrioridadBadge = (prioridad) => {
    const badges = {
      Baja: "bg-gray-100 text-gray-800",
      Media: "bg-blue-100 text-blue-800",
      Alta: "bg-orange-100 text-orange-800",
      Urgente: "bg-red-100 text-red-800",
    };
    return badges[prioridad] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Solicitudes de Mantenimiento
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          {showForm ? "Cancelar" : "Nueva Solicitud"}
        </button>
  const [searchPredio, setSearchPredio] = useState("");
  const [showPredioDropdown, setShowPredioDropdown] = useState(false);
  const [showMatriculaDropdown, setShowMatriculaDropdown] = useState(false);
  const [searchMatricula, setSearchMatricula] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("propietarios");
  const dropdownRefPredio = useRef(null);
  const dropdownRefMatricula = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefPredio.current && !dropdownRefPredio.current.contains(event.target)) {
        setShowPredioDropdown(false);
      }
      if (dropdownRefMatricula.current && !dropdownRefMatricula.current.contains(event.target)) {
        setShowMatriculaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [solicitudesData, matriculasData, mantenimientosData, prediosData, propietariosData] = await Promise.all([
        getSolicitudes(),
        getMatriculas(),
        getMantenimientos(),
        getPredios(),
        getPropietarios(),
      ]);
      setSolicitudes(solicitudesData);
      setMatriculas(matriculasData);
      setMantenimientos(mantenimientosData);
      setPredios(prediosData);
      setPropietarios(propietariosData);
      setError(null);
    } catch (err) {
      setError("Error al cargar datos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSolicitud(formData);
      await loadData();
      resetForm();
    } catch (err) {
      setError("Error al crear solicitud: " + err.message);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await updateSolicitudEstado(id, nuevoEstado);
      await loadData();
    } catch (err) {
      setError("Error al actualizar estado: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Está seguro de eliminar esta solicitud?")) return;
    try {
      await deleteSolicitud(id);
      await loadData();
    } catch (err) {
      setError("Error al eliminar: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      cc_propietario: "",
      id_predio: "",
      cod_matricula: "",
      id_mantenimiento: "",
      observaciones: "",
      prioridad: "Media",
    });
    setSearchPredio("");
    setShowForm(false);
  };

  const filteredPredios = predios.filter((p) => {
    // Si hay un propietario seleccionado, filtrar solo sus predios
    if (formData.cc_propietario) {
      // Comparar por CC del propietario
      if (p.propietario_cc !== formData.cc_propietario) {
        return false;
      }
    }
    
    // Aplicar búsqueda si hay texto
    if (!searchPredio) return true;
    const searchLower = searchPredio.toLowerCase();
    const predioText = `${p.direccion || ''} ${p.propietario?.nombre || ''} ${p.propietario?.apellido || ''}`.toLowerCase();
    return predioText.includes(searchLower);
  });

  const handleSelectPredio = (idPredio) => {
    const predio = predios.find(p => p.id === idPredio);
    
    // Buscar las matrículas asociadas a este predio
    const matriculasPredio = matriculas.filter(m => m.id_predio === idPredio);
    
    // Obtener el CC del propietario directamente del predio
    const ccPropietario = predio?.propietario_cc || "";
    
    setFormData({ 
      ...formData, 
      id_predio: idPredio,
      cc_propietario: ccPropietario,
      // Si solo hay una matrícula, seleccionarla automáticamente
      cod_matricula: matriculasPredio.length === 1 ? matriculasPredio[0].cod_matricula : ""
    });
    setSearchPredio("");
    setShowPredioDropdown(false);
  };

  const handleOpenFormWithPropietario = (propietarioCC) => {
    if (!propietarioCC) {
      setShowForm(true);
      return;
    }

    // Buscar los predios de este propietario usando propietario_cc
    const prediosPropietario = predios.filter(p => p.propietario_cc === propietarioCC);
    
    // Si tiene predios, preseleccionar el primero
    if (prediosPropietario.length > 0) {
      const primerPredio = prediosPropietario[0];
      const matriculasPredio = matriculas.filter(m => m.id_predio === primerPredio.id);
      
      setFormData({
        cc_propietario: propietarioCC,
        id_predio: primerPredio.id,
        // Si solo hay una matrícula, seleccionarla automáticamente
        cod_matricula: matriculasPredio.length === 1 ? matriculasPredio[0].cod_matricula : "",
        id_mantenimiento: "",
        observaciones: "",
        prioridad: "Media",
      });
    } else {
      // Si no tiene predios, solo establecer el propietario
      setFormData({
        cc_propietario: propietarioCC,
        id_predio: "",
        cod_matricula: "",
        id_mantenimiento: "",
        observaciones: "",
        prioridad: "Media",
      });
    }
    
    setShowForm(true);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      Pendiente: "bg-yellow-100 text-yellow-800",
      "En Proceso": "bg-blue-100 text-blue-800",
      Completado: "bg-green-100 text-green-800",
      Cancelado: "bg-red-100 text-red-800",
    };
    return badges[estado] || "bg-gray-100 text-gray-800";
  };

  const getPrioridadBadge = (prioridad) => {
    const badges = {
      Baja: "bg-gray-100 text-gray-800",
      Media: "bg-blue-100 text-blue-800",
      Alta: "bg-orange-100 text-orange-800",
      Urgente: "bg-red-100 text-red-800",
    };
    return badges[prioridad] || "bg-gray-100 text-gray-800";
  };

  const filteredSolicitudes = solicitudes.filter((s) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const propietario = s.predio?.propietario;
    
    return (
      s.id?.toString().includes(searchLower) ||
      s.cod_matricula?.toLowerCase().includes(searchLower) ||
      propietario?.cc?.toLowerCase().includes(searchLower) ||
      propietario?.nombre?.toLowerCase().includes(searchLower) ||
      propietario?.apellido?.toLowerCase().includes(searchLower) ||
      `${propietario?.nombre} ${propietario?.apellido}`.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Solicitudes de Mantenimiento
          </h1>
          <p className="text-gray-600">Gestiona las solicitudes de mantenimiento de propietarios y predios</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 shadow-sm">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 mb-8 shadow-md border border-gray-200">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, matrícula, cédula o nombre del propietario..."
              className="w-full pl-12 pr-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
        </div>

        {/* Pestañas principales */}
        <div className="bg-white rounded-t-xl shadow-lg border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("propietarios")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all ${
                activeTab === "propietarios"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Propietarios y Predios
            </button>
            <button
              onClick={() => setActiveTab("solicitudes")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all ${
                activeTab === "solicitudes"
                  ? "text-green-600 border-b-2 border-green-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Solicitudes Creadas ({filteredSolicitudes.length})
            </button>
          </div>
        </div>

        {/* Sección 1: Propietarios con sus predios */}
        {activeTab === "propietarios" && (
        <div className="bg-white rounded-b-xl shadow-lg overflow-hidden border border-gray-200 border-t-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <h2 className="text-xl font-bold text-white">Propietarios y Predios</h2>
            <p className="text-blue-100 text-sm mt-1">Selecciona un propietario para crear una solicitud</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Propietario</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cédula</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Predio</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSolicitudes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search size={48} className="mb-3 text-gray-300" />
                        <p className="text-lg font-medium">
                          {searchTerm ? "No se encontraron propietarios" : "No hay propietarios registrados"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm ? "Intenta con otros términos de búsqueda" : "Agrega propietarios para comenzar"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSolicitudes.map((s) => {
                    const propietario = s.predio?.propietario;
                    return (
                      <tr key={s.id} className="hover:bg-blue-50/50 transition-all duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-sm">
                                {propietario ? `${propietario.nombre[0]}${propietario.apellido[0]}` : "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {propietario ? `${propietario.nombre} ${propietario.apellido}` : "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {propietario?.cc || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {s.predio?.direccion || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenFormWithPropietario(propietario?.cc)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-150 text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            Crear Solicitud
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Sección 2: Solicitudes creadas */}
        {activeTab === "solicitudes" && (
        <div className="bg-white rounded-b-xl shadow-lg overflow-hidden border border-gray-200 border-t-0">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Solicitudes Creadas</h2>
            <p className="text-green-100 text-sm mt-1">Historial de solicitudes de mantenimiento</p>
          </div>
          <div className="overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-16 px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                  <th className="w-32 px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Propietario</th>
                  <th className="w-28 px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Predio</th>
                  <th className="w-32 px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Observaciones</th>
                  <th className="w-24 px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Prioridad</th>
                  <th className="w-24 px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                  <th className="w-20 px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSolicitudes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search size={48} className="mb-3 text-gray-300" />
                        <p className="text-lg font-medium">
                          {searchTerm ? "No se encontraron solicitudes" : "No hay solicitudes creadas"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm ? "Intenta con otros términos de búsqueda" : "Crea tu primera solicitud desde la pestaña de Propietarios"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSolicitudes.map((s) => {
                    const propietario = s.predio?.propietario;
                    return (
                      <tr key={`solicitud-${s.id}`} className="hover:bg-green-50 transition-colors border-b border-gray-100">
                        <td className="px-3 py-3">
                          <span className="text-xs font-semibold text-gray-900">#{s.id}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-green-600 font-semibold text-xs">
                                {propietario ? `${propietario.nombre[0]}${propietario.apellido[0]}` : "?"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-900 truncate">
                              {propietario ? `${propietario.nombre} ${propietario.apellido}` : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-700 truncate">
                          {s.predio?.direccion || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-700 truncate">
                          {mantenimientos.find(m => m.id === s.id_mantenimiento)?.nombre || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-600 truncate">
                          {s.observaciones || "-"}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            s.prioridad === 'Urgente' ? 'bg-red-100 text-red-700' :
                            s.prioridad === 'Alta' ? 'bg-orange-100 text-orange-700' :
                            s.prioridad === 'Media' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {s.prioridad || 'Media'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            s.estado === 'Completado' ? 'bg-green-100 text-green-700' :
                            s.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
                            s.estado === 'Cancelado' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {s.estado || 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Agregar Solicitud
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex overflow-hidden flex-1">
              {/* Sección del formulario */}
              <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto border-r border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative" ref={dropdownRefPredio}>
                  <label className="block text-sm text-gray-700 mb-1.5">Predio *</label>
                  <div
                    onClick={() => setShowPredioDropdown(!showPredioDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors text-sm"
                  >
                    <span className={formData.id_predio ? "text-gray-900" : "text-gray-400"}>
                      {formData.id_predio ? (predios.find(p => p.id === formData.id_predio)?.direccion || "Seleccione un predio") : "Seleccione un predio"}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                
                  {showPredioDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg overflow-hidden">
                      <div className="p-2 bg-gray-50 sticky top-0 border-b border-gray-200">
                        <input
                          type="text"
                          value={searchPredio}
                          onChange={(e) => setSearchPredio(e.target.value)}
                          placeholder="Buscar predio..."
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredPredios.length === 0 ? (
                          <div className="px-3 py-4 text-gray-400 text-center text-sm">
                            No se encontraron predios
                          </div>
                        ) : (
                          filteredPredios.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => handleSelectPredio(p.id)}
                              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                                formData.id_predio === p.id ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="font-medium text-gray-900 text-sm">{p.direccion}</div>
                              <div className="text-xs text-gray-500">
                                {p.propietario ? `${p.propietario.nombre} ${p.propietario.apellido}` : 'Sin propietario'}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={dropdownRefMatricula}>
                  <label className="block text-sm text-gray-700 mb-1.5">Matrícula *</label>
                  <div
                    onClick={() => formData.id_predio && setShowMatriculaDropdown(!showMatriculaDropdown)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 flex items-center justify-between text-sm ${
                      formData.id_predio ? 'cursor-pointer hover:border-gray-400' : 'cursor-not-allowed bg-gray-50'
                    } transition-colors`}
                  >
                    <span className={formData.cod_matricula ? "text-gray-900" : "text-gray-400"}>
                      {formData.cod_matricula || (formData.id_predio ? "Seleccione una matrícula" : "Seleccione primero un predio")}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                
                  {showMatriculaDropdown && formData.id_predio && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg overflow-hidden">
                      <div className="p-2 bg-gray-50 sticky top-0 border-b border-gray-200">
                        <input
                          type="text"
                          value={searchMatricula}
                          onChange={(e) => setSearchMatricula(e.target.value)}
                          placeholder="Buscar matrícula..."
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {(() => {
                          const matriculasPredio = matriculas.filter(m => {
                            if (m.id_predio !== formData.id_predio) return false;
                            if (!searchMatricula) return true;
                            return m.cod_matricula.toLowerCase().includes(searchMatricula.toLowerCase());
                          });
                          
                          if (matriculasPredio.length === 0) {
                            return (
                              <div className="px-3 py-4 text-gray-400 text-center text-sm">
                                {searchMatricula ? "No se encontraron matrículas" : "No hay matrículas disponibles"}
                              </div>
                            );
                          }
                          
                          return matriculasPredio.map((m) => (
                            <div
                              key={m.cod_matricula}
                              onClick={() => {
                                setFormData({ ...formData, cod_matricula: m.cod_matricula });
                                setSearchMatricula("");
                                setShowMatriculaDropdown(false);
                              }}
                              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                                formData.cod_matricula === m.cod_matricula ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="font-medium text-gray-900 text-sm">{m.cod_matricula}</div>
                              <div className="text-xs text-gray-500">
                                Estado: {m.estado || 'Activa'}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>



              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Tipo de Mantenimiento *
                  </label>
                  <select
                    value={formData.id_mantenimiento}
                    onChange={(e) =>
                      setFormData({ ...formData, id_mantenimiento: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione tipo</option>
                    {mantenimientos.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Prioridad</label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) =>
                      setFormData({ ...formData, prioridad: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option key="baja" value="Baja">Baja</option>
                    <option key="media" value="Media">Media</option>
                    <option key="alta" value="Alta">Alta</option>
                    <option key="urgente" value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows="3"
                  placeholder="Describa el problema o solicitud..."
                />
              </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded transition text-sm font-medium"
                  >
                    Crear Solicitud
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded transition text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Nueva Solicitud de Mantenimiento
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Matrícula *</label>
              <select
                value={formData.cod_matricula}
                onChange={(e) =>
                  setFormData({ ...formData, cod_matricula: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una matrícula</option>
                {matriculas.map((m) => (
                  <option key={m.cod_matricula} value={m.cod_matricula}>
                    {m.cod_matricula} - {m.predio?.direccion || 'Sin predio'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Tipo de Mantenimiento *
              </label>
              <select
                value={formData.id_mantenimiento}
                onChange={(e) =>
                  setFormData({ ...formData, id_mantenimiento: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione tipo de mantenimiento</option>
                {mantenimientos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Prioridad</label>
              <select
                value={formData.prioridad}
                onChange={(e) =>
                  setFormData({ ...formData, prioridad: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describa el problema o solicitud..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                Crear Solicitud
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-gray-700">Matrícula</th>
              <th className="px-4 py-3 text-left text-gray-700">Predio</th>
              <th className="px-4 py-3 text-left text-gray-700">Tipo</th>
              <th className="px-4 py-3 text-left text-gray-700">Prioridad</th>
              <th className="px-4 py-3 text-left text-gray-700">Estado</th>
              <th className="px-4 py-3 text-left text-gray-700">Observaciones</th>
              <th className="px-4 py-3 text-left text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-600">
                  No hay solicitudes registradas
                </td>
              </tr>
            ) : (
              solicitudes.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{s.id}</td>
                  <td className="px-4 py-3 text-gray-900">
                    {s.cod_matricula || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {s.predio?.direccion || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {s.mantenimiento?.nombre || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getPrioridadBadge(s.prioridad)}`}>
                      {s.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={s.estado}
                      onChange={(e) => handleEstadoChange(s.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs border-0 ${getEstadoBadge(s.estado)}`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                    {s.observaciones || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
              {/* Sección de información del propietario */}
              <div className="w-80 bg-gray-50 p-6 overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Información del Propietario</h3>
                
                {formData.cc_propietario ? (() => {
                  const propietario = propietarios.find(p => p.cc === formData.cc_propietario);
                  const selectedPredio = predios.find(p => p.id === formData.id_predio);
                  
                  if (propietario) {
                    return (
                      <div className="space-y-4" key={`propietario-info-${propietario.cc}`}>
                        <div key="nombre">
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Propietario</label>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {propietario.nombre} {propietario.apellido}
                          </p>
                        </div>
                        
                        <div key="cedula">
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Cédula</label>
                          <p className="text-sm font-medium text-gray-900 mt-1">{propietario.cc}</p>
                        </div>
                        
                        {selectedPredio && (
                          <div key="predio">
                            <label className="text-xs text-gray-500 uppercase tracking-wide">Predio</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {selectedPredio.direccion || 'N/A'}
                            </p>
                          </div>
                        )}
                        
                        {propietario.telefono && (
                          <div key="telefono">
                            <label className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{propietario.telefono}</p>
                          </div>
                        )}
                        
                        {propietario.correo && (
                          <div key="email">
                            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                            <p className="text-sm font-medium text-gray-900 mt-1 break-words">{propietario.correo}</p>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <p className="text-sm text-gray-400 italic">
                      Propietario no encontrado
                    </p>
                  );
                })() : (
                  <p className="text-sm text-gray-400 italic">
                    Seleccione un predio para ver la información del propietario
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
