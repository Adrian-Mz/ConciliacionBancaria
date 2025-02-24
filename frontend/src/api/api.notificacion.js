import { api } from "./api.config.js";

export const notificacionAPI = {
  getNotificacionesByUser: async (usuarioId) => {
    const response = await api.get(`/notificaciones/${usuarioId}`);
    return response.data;
  },

  marcarNotificacionLeida: async (id) => {
    const response = await api.put(`/notificaciones/${id}`, { leida: true });
    return response.data;
  },
};
