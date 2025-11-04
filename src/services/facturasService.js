import { api } from "./api";

export const getFacturas = async () => {
  return await api.get("/facturas");
};

export const getFactura = async (id) => {
  return await api.get(`/facturas/${id}`);
};

export const createFactura = async (data) => {
  return await api.post("/facturas", data);
};

export const updateFactura = async (id, data) => {
  return await api.put(`/facturas/${id}`, data);
};

export const deleteFactura = async (id) => {
  return await api.delete(`/facturas/${id}`);
};
