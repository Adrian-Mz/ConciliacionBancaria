import { UsuarioData } from "../data/usuarioData.js";

export const UsuarioService = {
  async getAllUsuarios() {
    return await UsuarioData.getAllUsuarios();
  },

  async getUsuarioById(id) {
    if (!id || isNaN(id)) throw new Error("ID de usuario inválido");
    return await UsuarioData.getUsuarioById(id);
  },

  async createUsuario(data) {
    if (!data.nombre || !data.correo || !data.contraseña || !data.rolId) {
      throw new Error("Todos los campos son obligatorios");
    }
    return await UsuarioData.createUsuario(data);
  },

  async updateUsuario(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No hay datos para actualizar");
    }
    return await UsuarioData.updateUsuario(id, data);
  },

  async deleteUsuario(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await UsuarioData.deleteUsuario(id);
  }
};
