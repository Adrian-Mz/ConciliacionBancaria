import { api } from "./api.config.js";

export const usuarioAPI = {
  login: async (correo, password) => {
    try {
      const response = await api.post("/auth/login", { correo, contraseña: password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error de conexión con el servidor";
    }
  },

  getAllUsuarios: async () => {
    try {
      const response = await api.get("/usuarios");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "No se pudieron obtener los usuarios";
    }
  },

  getUsuarioById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al obtener el usuario";
    }
  },

  createUsuario: async (data) => {
    try {
      const response = await api.post("/usuarios", data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al crear el usuario";
    }
  },

  updateUsuario: async (id, data) => {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al actualizar el usuario";
    }
  },

  deleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al eliminar el usuario";
    }
  },
};
