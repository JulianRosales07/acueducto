import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getPredios } from '../../services/prediosService';
import { getPropietarios, createPropietario } from '../../services/propietariosService';
import { createMatricula, getMatriculas } from '../../services/matriculasService';
import FormPredio from './FormPredio';

export default function FormMatricula({ onClose, onSuccess }) {
  const [predios, setPredios] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [propietariosFiltrados, setPropietariosFiltrados] = useState([]);
  const [busquedaPropietario, setBusquedaPropietario] = useState('');
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);
  const [predioSeleccionado, setPredioSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    cod_matricula: '',
    id_predio: '',
    estado: 'Activa',
    tipo_usuario: 'Residencial',
    tarifa: 'Basica'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [showFormPredio, setShowFormPredio] = useState(false);
  const [showFormPropietario, setShowFormPropietario] = useState(false);
  const [formPropietario, setFormPropietario] = useState({
    cc: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  });
  const [errorsPropietario, setErrorsPropietario] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [listaPredios, listaPropietarios] = await Promise.all([
          getPredios(),
          getPropietarios()
        ]);
        setPredios(listaPredios || []);
        setPropietarios(listaPropietarios || []);
        setPropietariosFiltrados(listaPropietarios || []);
      } catch (error) {
        toast.error('Error al cargar propietarios o predios');
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const term = busquedaPropietario.trim().toLowerCase();
    if (!term) {
      setPropietariosFiltrados(propietarios);
    } else {
      setPropietariosFiltrados(
        propietarios.filter(prop =>
          (prop.nombre && prop.nombre.toLowerCase().includes(term)) ||
          (prop.cc && String(prop.cc).toLowerCase().includes(term)) ||
          (prop.correo && prop.correo.toLowerCase().includes(term)) ||
          (prop.telefono && String(prop.telefono).toLowerCase().includes(term))
        )
      );
    }
  }, [busquedaPropietario, propietarios]);

  useEffect(() => {
    const generarCodigoMatricula = async () => {
      try {
        const matriculas = await getMatriculas();
        
        // Extraer números de códigos que empiezan con M (M001, M002, etc.)
        const numerosExistentes = matriculas
          .map(m => {
            const match = m.cod_matricula.match(/^M(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(num => num > 0);
        
        // Encontrar el siguiente número disponible
        const ultimoNumero = numerosExistentes.length > 0 ? Math.max(...numerosExistentes) : 0;
        const nuevoNumero = ultimoNumero + 1;
        const codigoGenerado = `M${nuevoNumero.toString().padStart(3, '0')}`;

        console.log('Códigos existentes:', matriculas.map(m => m.cod_matricula));
        console.log('Último número:', ultimoNumero);
        console.log('Nuevo código generado:', codigoGenerado);

        setFormData(prev => ({
          ...prev,
          cod_matricula: codigoGenerado
        }));
      } catch (error) {
        console.error('Error generando código de matrícula:', error);
      }
    };

    generarCodigoMatricula();
  }, []);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'id_predio':
        if (!value) {
          error = 'Debe seleccionar un predio';
        }
        break;
      case 'tipo_usuario':
        if (!value) {
          error = 'Debe seleccionar un tipo de usuario';
        }
        break;
      case 'tarifa':
        if (!value) {
          error = 'Debe especificar una tarifa';
        }
        break;
      case 'estado':
        if (!value) {
          error = 'Debe seleccionar un estado';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    ['id_predio', 'tipo_usuario', 'tarifa', 'estado'].forEach(key => {
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

  const handleSelectPredio = (predio) => {
    setPredioSeleccionado(predio);
    setFormData(prev => ({ ...prev, id_predio: predio.id }));
    setTouched(prev => ({ ...prev, id_predio: true }));
    const error = validateField('id_predio', predio.id);
    setErrors(prev => ({ ...prev, id_predio: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Marcar todos los campos como tocados
    const allTouched = {};
    ['id_predio', 'tipo_usuario', 'tarifa', 'estado'].forEach(key => {
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
      console.log('Datos a enviar:', formData);
      console.log('Validación del formulario:', {
        id_predio: formData.id_predio,
        tipo_usuario: formData.tipo_usuario,
        tarifa: formData.tarifa,
        estado: formData.estado
      });
      
      const result = await createMatricula(formData);
      console.log('Resultado de creación:', result);
      toast.success('Matrícula registrada exitosamente', { id: toastId });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar matrícula:', error);
      console.error('Error completo:', error?.response?.data);
      const msg = error?.response?.data?.message || error?.message || 'Error al procesar la matrícula';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
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
      
      // Seleccionar el propietario recién creado
      const nuevoPropietario = data.find(p => p.cc === formPropietario.cc);
      if (nuevoPropietario) {
        setPropietarioSeleccionado(nuevoPropietario);
        setBusquedaPropietario(`${nuevoPropietario.nombre} ${nuevoPropietario.apellido} - CC ${nuevoPropietario.cc}`);
      }
      
      // Cerrar formulario de propietario
      setShowFormPropietario(false);
      setFormPropietario({ cc: '', nombre: '', apellido: '', telefono: '', correo: '' });
      setErrorsPropietario({});
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Error al crear el propietario';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(errors).some(error => error);
  const isFormValid = !hasErrors && 
    Boolean(formData.id_predio) && 
    Boolean(formData.tipo_usuario) && 
    Boolean(formData.tarifa) && 
    Boolean(formData.estado);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Nueva Matrícula
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de Matrícula
            </label>
            <input
              type="text"
              name="cod_matricula"
              value={formData.cod_matricula}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propietario
            </label>
            
            {showFormPropietario ? (
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
                        setShowFormPropietario(false);
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar propietario por nombre o cédula..."
                  value={busquedaPropietario}
                  onChange={(e) => {
                    setBusquedaPropietario(e.target.value);
                    setMostrarResultados(true);
                    setPropietarioSeleccionado(null);
                    setPredioSeleccionado(null);
                    setFormData(prev => ({ ...prev, id_predio: '' }));
                  }}
                  onFocus={async () => {
                    setMostrarResultados(true);
                    // Recargar propietarios y predios al enfocar para reflejar nuevos datos
                    try {
                      const [listaPredios, listaPropietarios] = await Promise.all([
                        getPredios(),
                        getPropietarios()
                      ]);
                      setPredios(listaPredios || []);
                      setPropietarios(listaPropietarios || []);
                      // Refiltrar según búsqueda vigente
                      const term = busquedaPropietario.trim().toLowerCase();
                      const base = listaPropietarios || [];
                      setPropietariosFiltrados(
                        !term
                          ? base
                          : base.filter(prop =>
                              (prop.nombre && prop.nombre.toLowerCase().includes(term)) ||
                              (prop.cc && String(prop.cc).toLowerCase().includes(term)) ||
                              (prop.correo && prop.correo.toLowerCase().includes(term)) ||
                              (prop.telefono && String(prop.telefono).toLowerCase().includes(term))
                            )
                      );
                    } catch (e) {
                      // Silencioso
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                />

                {mostrarResultados && propietariosFiltrados.length > 0 && (
                  <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                    {propietariosFiltrados.map((prop) => (
                      <li
                        key={prop.id || prop.cc || prop.nombre}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm"
                        onMouseDown={() => {
                          setPropietarioSeleccionado(prop);
                          setBusquedaPropietario(`${prop.nombre || ''}${prop.cc ? ` - CC ${prop.cc}` : ''}`);
                          setMostrarResultados(false);
                        }}
                      >
                        <div className="font-medium">{prop.nombre}</div>
                        <div className="text-gray-500">{prop.cc ? `CC ${prop.cc}` : 'Sin documento'}</div>
                      </li>
                    ))}
                  </ul>
                )}
                
                <button
                  type="button"
                  onClick={() => setShowFormPropietario(true)}
                  className="w-full px-3 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded hover:bg-blue-50 text-sm"
                >
                  + Crear Nuevo Propietario
                </button>
              </div>
            )}

            {propietarioSeleccionado && (
              <div className="mt-3 border rounded-md">
                <div className="px-3 py-2 border-b bg-gray-50 text-sm font-medium">Predios de {propietarioSeleccionado.nombre}</div>
                <ul className="max-h-48 overflow-auto">
                  {predios
                    .filter(p => {
                      if (!p.propietario && !p.id_propietario) return false;
                      
                      // Comparar por id_propietario (que es la cédula)
                      const predioIdPropietario = p.id_propietario || p.propietario?.cc;
                      const propietarioCc = propietarioSeleccionado.cc;
                      
                      return predioIdPropietario === propietarioCc;
                    })
                    .map((predio) => (
                      <li
                        key={predio.id}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${formData.id_predio === predio.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                        onClick={() => handleSelectPredio(predio)}
                      >
                        <div className="font-medium">{predio.direccion}</div>
                        <div className="text-gray-500">
                          {predio.tipo && `Tipo: ${predio.tipo}`}
                          {predio.barrio && ` - Barrio: ${predio.barrio}`}
                        </div>
                      </li>
                    ))}
                </ul>
                {predios.filter(p => {
                  if (!p.propietario && !p.id_propietario) return false;
                  const predioIdPropietario = p.id_propietario || p.propietario?.cc;
                  const propietarioCc = propietarioSeleccionado.cc;
                  return predioIdPropietario === propietarioCc;
                }).length === 0 && (
                  <div className="px-3 py-2 text-center">
                    <p className="text-gray-500 text-sm mb-2">Este propietario no tiene predios registrados.</p>
                    <button
                      type="button"
                      onClick={() => setShowFormPredio(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Crear Predio
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mostrar predio seleccionado */}
            {predioSeleccionado && (
              <div className="mt-2 p-3 bg-green-50 border border-green-500 rounded">
                <p className="text-sm font-medium text-green-900">Predio seleccionado:</p>
                <p className="text-sm text-green-800">{predioSeleccionado.direccion}</p>
                <p className="text-xs text-green-700">Tipo: {predioSeleccionado.tipo}</p>
              </div>
            )}
            
            {errors.id_predio && touched.id_predio && (
              <p className="text-red-500 text-sm mt-1">{errors.id_predio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado del Servicio <span className="text-red-500">*</span>
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.estado && touched.estado
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
              <option value="Suspendida">Suspendida</option>
            </select>
            {errors.estado && touched.estado && (
              <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Usuario <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.tipo_usuario && touched.tipo_usuario
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
            </select>
            {errors.tipo_usuario && touched.tipo_usuario && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo_usuario}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarifa <span className="text-red-500">*</span>
            </label>
            <select
              name="tarifa"
              value={formData.tarifa}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-3 py-2 ${
                errors.tarifa && touched.tarifa
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="Basica">Básica</option>
              <option value="Especial">Especial</option>
              <option value="Premium">Premium</option>
            </select>
            {errors.tarifa && touched.tarifa && (
              <p className="text-red-500 text-sm mt-1">{errors.tarifa}</p>
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

      {/* Modal de crear predio */}
      {showFormPredio && propietarioSeleccionado && (
        <FormPredio
          onClose={() => setShowFormPredio(false)}
          onSuccess={async () => {
            // Recargar predios después de crear uno nuevo
            try {
              const toastId = toast.loading('Actualizando lista de predios...');
              const [listaPredios, listaPropietarios] = await Promise.all([
                getPredios(),
                getPropietarios()
              ]);
              setPredios(listaPredios || []);
              setPropietarios(listaPropietarios || []);
              toast.success('Predio creado. Ahora puedes seleccionarlo.', { id: toastId });
            } catch (error) {
              console.error('Error recargando datos:', error);
              toast.error('Error al recargar la lista de predios');
            }
            setShowFormPredio(false);
          }}
          propietarioPreseleccionado={propietarioSeleccionado}
        />
      )}
    </div>
  );
}
