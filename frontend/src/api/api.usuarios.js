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

  getUsuarios: async () => {
    try {
      const response = await api.get("/usuarios");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.error : "Error al obtener usuarios";
    }
  }
};
