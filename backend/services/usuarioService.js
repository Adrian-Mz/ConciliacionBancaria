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

    // 🔹 Verificar si el correo ya está en uso
    const existingUser = await UsuarioData.getUsuarioByCorreo(data.correo);
    if (existingUser) {
      throw new Error("El correo ya está en uso.");
    }

    // 🔹 Generamos el hash de la contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.contraseña, saltRounds);
    data.contraseña = hashedPassword;

    return await UsuarioData.createUsuario(data);
  },

  async updateUsuario(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No hay datos para actualizar");
    }

    // 🔹 Verificar si se proporciona una nueva contraseña
    if (data.contraseña) {
      const saltRounds = 10;
      data.contraseña = await bcrypt.hash(data.contraseña, saltRounds);
    } else {
      delete data.contraseña; // 🔹 Evitar sobrescribir con `undefined`
    }

    return await UsuarioData.updateUsuario(id, data);
  },

  async deleteUsuario(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await UsuarioData.deleteUsuario(id);
  }
};
