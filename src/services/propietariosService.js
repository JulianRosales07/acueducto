import { api } from "./api";

export const getPropietarios = async () => {
  // TODO: Implementar GET para listar propietarios
  return await api.get("/propietarios");
};

export const getPropietario = async (cc) => {
  // TODO: Implementar GET para obtener un propietario
  return await api.get(`/propietarios/${cc}`);
};

export const createPropietario = async (data) => {
  // Validar que no exista un propietario con la misma cédula
  const existingPropietarios = await getPropietarios();
  const duplicate = existingPropietarios.find(p => p.cc === data.cc);
  if (duplicate) {
    throw new Error('Ya existe un propietario con esta cédula');
  }
  return await api.post("/propietarios", data);
};

export const updatePropietario = async (cc, data) => {
  // TODO: Implementar PUT para actualizar propietario
  return await api.put(`/propietarios/${cc}`, data);
};

export const deletePropietario = async (cc) => {
  // TODO: Implementar DELETE para eliminar propietario
  return await api.delete(`/propietarios/${cc}`);
};
