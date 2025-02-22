import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioData } from "../data/usuarioData.js";
import dotenv from "dotenv";

dotenv.config();

export const AuthService = {
  async login(correo, contraseña) {
    if (!correo || !contraseña) {
      throw new Error("Correo y contraseña son obligatorios");
    }

    // Buscar usuario por correo
    const usuario = await UsuarioData.getUsuarioByCorreo(correo);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Comparar contraseñas
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      throw new Error("Contraseña incorrecta");
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rolId: usuario.rolId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rolId: usuario.rolId } };
  }
};
