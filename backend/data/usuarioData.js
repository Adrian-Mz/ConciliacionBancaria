import prisma from "./prisma.js";

export const UsuarioData = {
  async getAllUsuarios() {
    return await prisma.usuario.findMany({ include: { rol: true } });
  },

  async getUsuarioById(id) {
    return await prisma.usuario.findUnique({ where: { id }, include: { rol: true } });
  },

  async createUsuario(data) {
    return await prisma.usuario.create({ data });
  },

  async updateUsuario(id, data) {
    return await prisma.usuario.update({ where: { id }, data });
  },

  async deleteUsuario(id) {
    return await prisma.usuario.delete({ where: { id } });
  }
};
