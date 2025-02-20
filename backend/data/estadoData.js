import prisma from "./prisma.js";

export const EstadoData = {
  async getAllEstados() {
    return await prisma.estado.findMany();
  },

  async getEstadoById(id) {
    return await prisma.estado.findUnique({ where: { id } });
  },

  async createEstado(data) {
    return await prisma.estado.create({ data });
  }
};
