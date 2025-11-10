import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import {
  getMantenimientos,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento,
} from "../services/mantenimientosService";

export default function MantenimientosPage() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "Activo",
    fecha: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadMantenimientos();
  }, []);

  const loadMantenimientos = async () => {
    try {
      setLoading(true);
      const data = await getMantenimientos();
      setMantenimientos(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar mantenimientos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMantenimiento(editingId, formData);
      } else {
        await createMantenimiento(formData);
      }
      await loadMantenimientos();
      resetForm();
    } catch (err) {
      setError("Error al guardar: " + err.message);
    }
  };

  const handleEdit = (mantenimiento) => {
    setEditingId(mantenimiento.id);
    setFormData({
      nombre: mantenimiento.nombre,
      descripcion: mantenimiento.descripcion || "",
      estado: mantenimiento.estado || "Activo",
      fecha: mantenimiento.fecha || new Date().toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Está seguro de eliminar este mantenimiento?")) return;
    try {
      await deleteMantenimiento(id);
      await loadMantenimientos();
    } catch (err) {
      setError("Error al eliminar: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      estado: "Activo",
      fecha: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setShowForm(false);
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
          Gestión de Mantenimientos
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          {showForm ? "Cancelar" : "Nuevo Mantenimiento"}
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
            {editingId ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                {editingId ? "Actualizar" : "Crear"}
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
              <th className="px-4 py-3 text-left text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-gray-700">Descripción</th>
              <th className="px-4 py-3 text-left text-gray-700">Estado</th>
              <th className="px-4 py-3 text-left text-gray-700">Fecha</th>
              <th className="px-4 py-3 text-left text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mantenimientos.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-600">
                  No hay mantenimientos registrados
                </td>
              </tr>
            ) : (
              mantenimientos.map((m) => (
                <tr key={m.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{m.id}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{m.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {m.descripcion || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${m.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : m.estado === "Completado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {m.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.fecha}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(m)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
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
