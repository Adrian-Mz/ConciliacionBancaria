import { api } from "./api.config.js";

export const libroMayorAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/libro-mayor");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los registros de Libro Mayor:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/libro-mayor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el registro con ID ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      // Asegurarse de que `data` sea un array antes de enviarlo
      const payload = Array.isArray(data) ? data : [data];
  
      const response = await api.post("/libro-mayor", payload);
      return response.data;
    } catch (error) {
      console.error("Error al crear registros en el Libro Mayor:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/libro-mayor/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el registro con ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/libro-mayor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el registro con ID ${id}:`, error);
      throw error;
    }
  },
};
