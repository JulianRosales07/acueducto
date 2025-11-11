import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createPropietario, updatePropietario } from '../../services/propietariosService';

export default function FormPropietario({ propietario, onClose, onSuccess }) {
  const [form, setForm] = useState({
    cc: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propietario) {
      setForm({
        cc: propietario.cc || '',
        nombre: propietario.nombre || '',
        apellido: propietario.apellido || '',
        telefono: propietario.telefono || '',
        correo: propietario.correo || ''
      });
    } else {
      setForm({ cc: '', nombre: '', apellido: '', telefono: '', correo: '' });
    }
    setErrors({});
    setTouched({});
  }, [propietario]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'cc':
        if (!value || !value.trim()) {
          error = 'La cédula es obligatoria';
        } else if (!/^\d{6,10}$/.test(value.trim())) {
          error = 'La cédula debe tener entre 6 y 10 dígitos';
        }
        break;
      case 'nombre':
        if (!value || !value.trim()) {
          error = 'El nombre es obligatorio';
        } else if (value.trim().length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'apellido':
        if (!value || !value.trim()) {
          error = 'El apellido es obligatorio';
        } else if (value.trim().length < 2) {
          error = 'El apellido debe tener al menos 2 caracteres';
        }
        break;
      case 'telefono':
        if (!value || !value.trim()) {
          error = 'El teléfono es obligatorio';
        } else if (!/^\d{7,10}$/.test(value.trim())) {
          error = 'El teléfono debe tener entre 7 y 10 dígitos';
        }
        break;
      case 'correo':
        if (!value || !value.trim()) {
          error = 'El correo electrónico es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'El correo electrónico no es válido';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(form).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validar formulario completo
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Guardando...');
    
    try {
      if (propietario) {
        await updatePropietario(propietario.id || propietario.cc, form);
        toast.success('Propietario actualizado exitosamente', { id: toastId });
      } else {
        await createPropietario(form);
        toast.success('Propietario creado exitosamente', { id: toastId });
      }
      if (typeof onSuccess === 'function') onSuccess();
      if (typeof onClose === 'function') onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar el propietario';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(errors).some(error => error);
  const isFormValid = !hasErrors && Object.keys(form).every(key => form[key]?.trim());

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          {propietario ? 'Editar Propietario' : 'Nuevo Propietario'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cédula <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cc"
              placeholder="Ej: 1234567890"
              value={form.cc}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!!propietario}
              className={`w-full border rounded px-3 py-2 ${
                errors.cc && touched.cc
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.cc && touched.cc && form.cc
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } ${propietario ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.cc && touched.cc && (
              <p className="text-red-500 text-sm mt-1">{errors.cc}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Juan"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.nombre && touched.nombre
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.nombre && touched.nombre && form.nombre
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.nombre && touched.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              placeholder="Ej: Pérez"
              value={form.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.apellido && touched.apellido
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.apellido && touched.apellido && form.apellido
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.apellido && touched.apellido && (
              <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="telefono"
              placeholder="Ej: 3001234567"
              value={form.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.telefono && touched.telefono
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.telefono && touched.telefono && form.telefono
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.telefono && touched.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="correo"
              placeholder="Ej: propietario@email.com"
              value={form.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.correo && touched.correo
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.correo && touched.correo && form.correo
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.correo && touched.correo && (
              <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
