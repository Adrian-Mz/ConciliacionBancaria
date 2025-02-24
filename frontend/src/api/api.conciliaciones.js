import { api } from "./api.config.js";

export const conciliacionAPI = {
  getAllConciliaciones: async () => {
    const response = await api.get("/conciliaciones");
    return response.data;
  },

  getConciliacionById: async (id) => {
    const response = await api.get(`/conciliaciones/${id}`);
    return response.data;
  },

  createConciliacion: async (data) => {
    const response = await api.post("/conciliaciones", data);
    return response.data;
  },

  updateConciliacion: async (id, data) => {
    const response = await api.put(`/conciliaciones/${id}`, data);
    return response.data;
  },

  updateEstadoConciliacion: async (id, estado, usuarioId, rol, observaciones = null) => {
    const response = await api.put(`/conciliaciones/estado/${id}`, { estado, usuarioId, rol, observaciones });
    return response.data;
  },

  generarReporteConciliacion: async (id) => {
    const response = await api.get(`/conciliaciones/reporte/${id}`, { responseType: "blob" });
    return response.data;
  },
};
