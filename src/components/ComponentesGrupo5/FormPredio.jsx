import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getPropietarios, createPropietario } from '../../services/propietariosService';
import { createPredio, updatePredio } from '../../services/prediosService';

export default function FormPredio({ onClose, onSuccess, predio = null, propietarioPreseleccionado = null }) {
  const [propietarios, setPropietarios] = useState([]);
  const [propietariosFiltrados, setPropietariosFiltrados] = useState([]);
  const [busquedaPropietario, setBusquedaPropietario] = useState('');
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);
  const [mostrarFormPropietario, setMostrarFormPropietario] = useState(false);
  const [formPropietario, setFormPropietario] = useState({
    cc: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  });
  const [errorsPropietario, setErrorsPropietario] = useState({});
  const [formData, setFormData] = useState({
    direccion: predio?.direccion || '',
    propietario_cc: predio?.propietario_cc || '',
    telefono: predio?.telefono || '',
    correo: predio?.correo || '',
    tipo: predio?.tipo || 'Residencial'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarPropietarios = async () => {
      try {
        const data = await getPropietarios();
        setPropietarios(data);
        setPropietariosFiltrados(data);
        
        // Si hay un propietario preseleccionado, establecerlo en el form
        if (propietarioPreseleccionado) {
          setFormData(prev => ({
            ...prev,
            propietario_cc: propietarioPreseleccionado.cc,
            correo: propietarioPreseleccionado.correo || prev.correo,
            telefono: propietarioPreseleccionado.telefono || prev.telefono
          }));
          setPropietarioSeleccionado(propietarioPreseleccionado);
        } else if (predio?.propietario_cc) {
          const propietarioExistente = data.find(p => p.cc === predio.propietario_cc);
          if (propietarioExistente) {
            setPropietarioSeleccionado(propietarioExistente);
            setFormData(prev => ({
              ...prev,
              propietario_cc: propietarioExistente.cc,
              correo: propietarioExistente.correo || prev.correo,
              telefono: propietarioExistente.telefono || prev.telefono
            }));
          }
        }
      } catch (error) {
        toast.error('Error al cargar los propietarios');
      }
    };
    cargarPropietarios();
  }, [propietarioPreseleccionado, predio]);

  useEffect(() => {
    if (busquedaPropietario.trim() === '') {
      setPropietariosFiltrados(propietarios);
    } else {
      const termino = busquedaPropietario.toLowerCase();
      const filtrados = propietarios.filter(p =>
        p.cc.toLowerCase().includes(termino) ||
        p.nombre.toLowerCase().includes(termino) ||
        p.apellido.toLowerCase().includes(termino)
      );
      setPropietariosFiltrados(filtrados);
    }
  }, [busquedaPropietario, propietarios]);

  // Sincronizar propietarioSeleccionado con formData.propietario_cc
  useEffect(() => {
    if (propietarioSeleccionado && formData.propietario_cc !== propietarioSeleccionado.cc) {
      setFormData(prev => ({ ...prev, propietario_cc: propietarioSeleccionado.cc }));
    }
  }, [propietarioSeleccionado]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'direccion':
        if (!value || !value.trim()) {
          error = 'La dirección es obligatoria';
        } else if (value.trim().length < 10) {
          error = 'La dirección debe tener al menos 10 caracteres';
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
      case 'tipo':
        if (!value) {
          error = 'Debe seleccionar un tipo de predio';
        }
        break;
      case 'propietario_cc':
        if (!value) {
          error = 'Debe seleccionar un propietario';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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

  const handleSelectPropietario = (propietario) => {
    console.log('Propietario seleccionado:', propietario);
    setPropietarioSeleccionado(propietario);
    const nuevosDatos = { 
      ...formData, 
      propietario_cc: propietario.cc,
      correo: propietario.correo || '',
      telefono: propietario.telefono || ''
    };
    console.log('Nuevos datos del formulario:', nuevosDatos);
    setFormData(nuevosDatos);
    setBusquedaPropietario('');
    setTouched(prev => ({ ...prev, propietario_cc: true }));
    const error = validateField('propietario_cc', propietario.cc);
    setErrors(prev => ({ ...prev, propietario_cc: error }));
  };

  const validatePropietarioField = (name, value) => {
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

  const handleChangePropietario = (e) => {
    const { name, value } = e.target;
    setFormPropietario(prev => ({ ...prev, [name]: value }));
    const error = validatePropietarioField(name, value);
    setErrorsPropietario(prev => ({ ...prev, [name]: error }));
  };

  const handleCrearPropietario = async () => {
    // Validar todos los campos del propietario
    const newErrors = {};
    Object.keys(formPropietario).forEach(key => {
      const error = validatePropietarioField(key, formPropietario[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrorsPropietario(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creando propietario...');

    try {
      await createPropietario(formPropietario);
      toast.success('Propietario creado exitosamente', { id: toastId });
      
      // Recargar lista de propietarios
      const data = await getPropietarios();
      setPropietarios(data);
      setPropietariosFiltrados(data);
      
      // Seleccionar el propietario recién creado y auto-completar datos
      const nuevoPropietario = data.find(p => p.cc === formPropietario.cc);
      if (nuevoPropietario) {
        setPropietarioSeleccionado(nuevoPropietario);
        setFormData(prev => ({ 
          ...prev, 
          propietario_cc: nuevoPropietario.cc,
          correo: nuevoPropietario.correo,
          telefono: nuevoPropietario.telefono
        }));
      }
      
      // Cerrar formulario de propietario
      setMostrarFormPropietario(false);
      setFormPropietario({ cc: '', nombre: '', apellido: '', telefono: '', correo: '' });
      setErrorsPropietario({});
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Error al crear el propietario';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validar formulario completo
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    // Verificar que propietario_cc esté presente
    if (!formData.propietario_cc) {
      toast.error('Debe seleccionar un propietario');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Guardando...');

    try {
      console.log('Datos a enviar:', formData);
      let resultado;
      if (predio) {
        console.log('Actualizando predio ID:', predio.id);
        resultado = await updatePredio(predio.id, formData);
        console.log('Resultado actualización:', resultado);
        toast.success('Predio actualizado exitosamente', { id: toastId });
      } else {
        console.log('Creando nuevo predio');
        resultado = await createPredio(formData);
        console.log('Resultado creación:', resultado);
        toast.success('Predio registrado exitosamente', { id: toastId });
      }
      
      // Pequeño delay para asegurar que el backend procese la relación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      const msg = error?.response?.data?.message || error?.message || 'Error al guardar el predio';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(errors).some(error => error);
  const isFormValid = !hasErrors && Object.keys(formData).every(key => formData[key]?.toString().trim());

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative z-50 shadow-2xl border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          {predio ? 'Editar Predio' : 'Nuevo Predio'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.direccion && touched.direccion
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.direccion && touched.direccion && formData.direccion
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Ej: Calle 123 #45-67"
            />
            {errors.direccion && touched.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propietario <span className="text-red-500">*</span>
            </label>
            {predio && !predio.propietario_cc && (
              <p className="text-xs text-amber-600 mb-2">
                Este predio no tiene propietario asignado. Por favor seleccione uno.
              </p>
            )}
            
            {propietarioSeleccionado ? (
              <div className="border border-green-500 rounded px-3 py-2 bg-green-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {propietarioSeleccionado.nombre} {propietarioSeleccionado.apellido}
                    </p>
                    <p className="text-sm text-gray-600">CC: {propietarioSeleccionado.cc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPropietarioSeleccionado(null);
                      setFormData(prev => ({ ...prev, propietario_cc: '', correo: '', telefono: '' }));
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : mostrarFormPropietario ? (
              <div className="border border-blue-300 rounded p-4 bg-blue-50">
                <h3 className="font-medium text-blue-900 mb-3">Crear Nuevo Propietario</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      name="cc"
                      placeholder="Cédula (6-10 dígitos)"
                      value={formPropietario.cc}
                      onChange={handleChangePropietario}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        errorsPropietario.cc ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errorsPropietario.cc && (
                      <p className="text-red-500 text-xs mt-1">{errorsPropietario.cc}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre"
                      value={formPropietario.nombre}
                      onChange={handleChangePropietario}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        errorsPropietario.nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errorsPropietario.nombre && (
                      <p className="text-red-500 text-xs mt-1">{errorsPropietario.nombre}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Apellido"
                      value={formPropietario.apellido}
                      onChange={handleChangePropietario}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        errorsPropietario.apellido ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errorsPropietario.apellido && (
                      <p className="text-red-500 text-xs mt-1">{errorsPropietario.apellido}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="telefono"
                      placeholder="Teléfono (7-10 dígitos)"
                      value={formPropietario.telefono}
                      onChange={handleChangePropietario}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        errorsPropietario.telefono ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errorsPropietario.telefono && (
                      <p className="text-red-500 text-xs mt-1">{errorsPropietario.telefono}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="correo"
                      placeholder="Correo electrónico"
                      value={formPropietario.correo}
                      onChange={handleChangePropietario}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        errorsPropietario.correo ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errorsPropietario.correo && (
                      <p className="text-red-500 text-xs mt-1">{errorsPropietario.correo}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleCrearPropietario}
                      disabled={loading}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      Crear Propietario
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarFormPropietario(false);
                        setFormPropietario({ cc: '', nombre: '', apellido: '', telefono: '', correo: '' });
                        setErrorsPropietario({});
                      }}
                      disabled={loading}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Buscar por cédula o nombre..."
                  value={busquedaPropietario}
                  onChange={(e) => setBusquedaPropietario(e.target.value)}
                  className={`w-full border rounded px-3 py-2 mb-2 ${
                    errors.propietario_cc && touched.propietario_cc
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {busquedaPropietario && (
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded mb-2 bg-white shadow-lg relative z-10">
                    {propietariosFiltrados.length > 0 ? (
                      propietariosFiltrados.map((propietario) => (
                        <button
                          key={propietario.cc}
                          type="button"
                          onClick={() => handleSelectPropietario(propietario)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b last:border-b-0"
                        >
                          <p className="font-medium">{propietario.nombre} {propietario.apellido}</p>
                          <p className="text-sm text-gray-600">CC: {propietario.cc}</p>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-gray-500 text-sm">No se encontraron propietarios</p>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setMostrarFormPropietario(true)}
                  className="w-full px-3 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded hover:bg-blue-50 text-sm"
                >
                  + Crear Nuevo Propietario
                </button>
              </>
            )}
            {errors.propietario_cc && touched.propietario_cc && (
              <p className="text-red-500 text-sm mt-1">{errors.propietario_cc}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Predio <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.tipo && touched.tipo
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Rural">Rural</option>
            </select>
            {errors.tipo && touched.tipo && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
              {propietarioSeleccionado && <span className="text-xs text-gray-500 ml-2">(del propietario)</span>}
            </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly={!!propietarioSeleccionado}
              className={`w-full border rounded px-3 py-2 ${
                propietarioSeleccionado ? 'bg-gray-100 cursor-not-allowed' : ''
              } ${
                errors.telefono && touched.telefono
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.telefono && touched.telefono && formData.telefono
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Ej: 3001234567"
            />
            {errors.telefono && touched.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico <span className="text-red-500">*</span>
              {propietarioSeleccionado && <span className="text-xs text-gray-500 ml-2">(del propietario)</span>}
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly={!!propietarioSeleccionado}
              className={`w-full border rounded px-3 py-2 ${
                propietarioSeleccionado ? 'bg-gray-100 cursor-not-allowed' : ''
              } ${
                errors.correo && touched.correo
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : !errors.correo && touched.correo && formData.correo
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Ej: propietario@email.com"
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
