import { api } from "./api";

export const getSolicitudes = async () => {
  const response = await api.get("/solicitudes");
  return response;
};

export const getSolicitud = async (id) => {
  const response = await api.get(`/solicitudes/${id}`);
  return response;
};

export const createSolicitud = async (data) => {
  const response = await api.post("/solicitudes", data);
  return response;
};

export const updateSolicitudEstado = async (id, estado) => {
  const response = await api.put(`/solicitudes/${id}/estado`, { estado });
  return response;
};

export const deleteSolicitud = async (id) => {
  const response = await api.delete(`/solicitudes/${id}`);
  return response;
};
