import { api } from "./api.config.js";

export const rolAPI = {
  getAllRoles: async () => {
    try {
      const response = await api.get("/roles");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al obtener los roles";
    }
  },

  getRolById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al obtener el rol";
    }
  },

  createRol: async (data) => {
    try {
      const response = await api.post("/roles", data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al crear el rol";
    }
  },

  updateRol: async (id, data) => {
    try {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al actualizar el rol";
    }
  },

  deleteRol: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al eliminar el rol";
    }
  },
};
