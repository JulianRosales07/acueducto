import { useState, useEffect } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuariosService';
import { toast } from 'react-hot-toast';
import { User, Edit2, Trash2, Search, Plus } from 'lucide-react';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    cc: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const datos = await getUsuarios();
      setUsuarios(datos || []);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const termino = busqueda.toLowerCase();
    return (
      u.cc?.toString().includes(termino) ||
      u.nombre?.toLowerCase().includes(termino) ||
      u.apellido?.toLowerCase().includes(termino) ||
      u.correo?.toLowerCase().includes(termino)
    );
  });

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'cc':
        if (!value.trim()) error = 'La cédula es obligatoria';
        else if (!/^\d{6,10}$/.test(value.trim())) error = 'Cédula debe tener 6-10 dígitos';
        break;
      case 'nombre':
        if (!value.trim()) error = 'El nombre es obligatorio';
        else if (value.trim().length < 2) error = 'Mínimo 2 caracteres';
        break;
      case 'apellido':
        if (!value.trim()) error = 'El apellido es obligatorio';
        else if (value.trim().length < 2) error = 'Mínimo 2 caracteres';
        break;
      case 'telefono':
        if (!value.trim()) error = 'El teléfono es obligatorio';
        else if (!/^\d{7,10}$/.test(value.trim())) error = 'Teléfono debe tener 7-10 dígitos';
        break;
      case 'correo':
        if (!value.trim()) error = 'El correo es obligatorio';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'Correo inválido';
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Corrige los errores del formulario');
      return;
    }

    const toastId = toast.loading(editando ? 'Actualizando...' : 'Guardando...');
    try {
      if (editando) {
        await updateUsuario(formData.cc, formData);
        toast.success('Usuario actualizado', { id: toastId });
      } else {
        await createUsuario(formData);
        toast.success('Usuario registrado', { id: toastId });
      }
      await cargarUsuarios();
      cerrarModal();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Error al guardar';
      toast.error(msg, { id: toastId });
    }
  };

  const handleEditar = (usuario) => {
    setFormData(usuario);
    setEditando(true);
    setShowModal(true);
  };

  const handleEliminar = async (cc) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    
    const toastId = toast.loading('Eliminando...');
    try {
      await deleteUsuario(cc);
      toast.success('Usuario eliminado', { id: toastId });
      await cargarUsuarios();
    } catch (error) {
      toast.error('Error al eliminar', { id: toastId });
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(false);
    setFormData({ cc: '', nombre: '', apellido: '', telefono: '', correo: '' });
    setErrors({});
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Usuario
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por cédula, nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Cédula</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Apellido</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Teléfono</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Correo</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario, index) => (
                  <tr key={usuario.cc} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">{usuario.cc}</td>
                    <td className="px-4 py-3 text-sm">{usuario.nombre}</td>
                    <td className="px-4 py-3 text-sm">{usuario.apellido}</td>
                    <td className="px-4 py-3 text-sm">{usuario.telefono}</td>
                    <td className="px-4 py-3 text-sm">{usuario.correo}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditar(usuario)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminar(usuario.cc)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              {editando ? 'Editar Usuario' : 'Registrar Usuario'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cc"
                  value={formData.cc}
                  onChange={handleChange}
                  disabled={editando}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.cc ? 'border-red-500' : 'border-gray-300'} ${editando ? 'bg-gray-100' : ''}`}
                  placeholder="1234567890"
                />
                {errors.cc && <p className="text-red-500 text-xs mt-1">{errors.cc}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Juan"
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Pérez"
                />
                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="3001234567"
                />
                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.correo ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="usuario@ejemplo.com"
                />
                {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
