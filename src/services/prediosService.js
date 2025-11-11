import { api } from "./api";

export const getPredios = async () => {
  // TODO: Implementar GET para listar predios
  return await api.get("/predios");
};

export const getPredio = async (id) => {
  // TODO: Implementar GET para obtener un predio
  return await api.get(`/predios/${id}`);
};

export const createPredio = async (data) => {
  console.log('createPredio - Datos recibidos:', data);
  
  // El backend espera propietario_cc
  const dataToSend = {
    direccion: data.direccion,
    tipo: data.tipo,
    telefono: data.telefono,
    correo: data.correo,
    propietario_cc: data.propietario_cc,
  };
  
  // Validar que no exista un predio con la misma dirección para el mismo propietario
  const existingPredios = await getPredios();
  const duplicate = existingPredios.find(p =>
    p.direccion.toLowerCase() === data.direccion.toLowerCase() &&
    p.propietario_cc === data.propietario_cc
  );
  if (duplicate) {
    console.error('Predio duplicado encontrado:', duplicate);
    throw new Error('Ya existe un predio con esta dirección para este propietario');
  }
  console.log('Enviando al backend:', dataToSend);
  const resultado = await api.post("/predios", dataToSend);
  console.log('Respuesta del backend:', resultado);
  return resultado;
};

export const updatePredio = async (id, data) => {
  console.log('updatePredio - ID:', id, 'Datos:', data);
  
  // El backend espera propietario_cc
  const dataToSend = {
    direccion: data.direccion,
    tipo: data.tipo,
    telefono: data.telefono,
    correo: data.correo,
    propietario_cc: data.propietario_cc,
  };
  
  console.log('Enviando al backend:', dataToSend);
  const resultado = await api.put(`/predios/${id}`, dataToSend);
  console.log('Respuesta del backend (update):', resultado);
  return resultado;
};

export const deletePredio = async (id) => {
  // TODO: Implementar DELETE para eliminar predio
  return await api.delete(`/predios/${id}`);
};
