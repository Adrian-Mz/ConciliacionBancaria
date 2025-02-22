import bcrypt from "bcrypt";
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

    // 🔹 Generamos el hash de la contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.contraseña, saltRounds);

    // 🔹 Reemplazamos la contraseña en texto plano por el hash generado
    data.contraseña = hashedPassword;

    return await UsuarioData.createUsuario(data);
  },

  async updateUsuario(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No hay datos para actualizar");
    }

    // 🔹 Si el usuario intenta actualizar la contraseña, la encriptamos nuevamente
    if (data.contraseña) {
      const saltRounds = 10;
      data.contraseña = await bcrypt.hash(data.contraseña, saltRounds);
    }

    return await UsuarioData.updateUsuario(id, data);
  },

  async deleteUsuario(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await UsuarioData.deleteUsuario(id);
  }
};
