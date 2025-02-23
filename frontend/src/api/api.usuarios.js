import { api } from "./api.config.js";

export const usuarioAPI = {
  login: async (correo, password) => {
    try {
      const response = await api.post("/auth/login", { correo, contraseña: password });
      return response.data; // Devuelve el token y usuario
    } catch (error) {
      throw error.response ? error.response.data.error : "Error de conexión con el servidor";
    }
  },

  async getAllUsuarios() {
    const response = await api.get("/usuarios");
    return response.data;
  },

  async getUsuarioById(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async createUsuario(data) {
    const response = await api.post("/usuarios", data);
    return response.data;
  },

  async updateUsuario(id, data) {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  async deleteUsuario(id) {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};
