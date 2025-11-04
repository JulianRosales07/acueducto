import { api } from "./api";

export const getMantenimientos = async () => {
  const response = await api.get("/mantenimientos");
  return response;
};

export const getMantenimiento = async (id) => {
  const response = await api.get(`/mantenimientos/${id}`);
  return response;
};

export const createMantenimiento = async (data) => {
  const response = await api.post("/mantenimientos", data);
  return response;
};

export const updateMantenimiento = async (id, data) => {
  const response = await api.put(`/mantenimientos/${id}`, data);
  return response;
};

export const deleteMantenimiento = async (id) => {
  const response = await api.delete(`/mantenimientos/${id}`);
  return response;
};
