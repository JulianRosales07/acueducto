import { api } from "./api";

export const getMatriculas = async () => {
  const response = await api.get("/matriculas");
  return response;
};

export const getMatricula = async (cod) => {
  const response = await api.get(`/matriculas/${cod}`);
  return response;
};



export const createMatricula = async (data) => {
  const response = await api.post("/matriculas", data);
  return response;
};

export const updateMatricula = async (cod, data) => {
  const response = await api.put(`/matriculas/${cod}`, data);
  return response;
};

export const deleteMatricula = async (cod) => {
  const response = await api.delete(`/matriculas/${cod}`);
  return response;
};
