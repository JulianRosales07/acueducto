import { useEffect, useState } from "react";
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitudEstado,
  deleteSolicitud,
} from "../services/solicitudesService";
import { getMatriculas } from "../services/matriculasService";
import { getMantenimientos } from "../services/mantenimientosService";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
      </div>

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
      </div>
    </div>
  );
}
