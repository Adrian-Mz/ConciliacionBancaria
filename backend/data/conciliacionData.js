import prisma from "./prisma.js";

export const ConciliacionData = {
  async getAllConciliaciones() {
    return await prisma.conciliacion.findMany({ include: { usuario: true, estado: true } });
  },

  async getConciliacionById(id) {
    return await prisma.conciliacion.findUnique({ where: { id }, include: { usuario: true, estado: true } });
  },

  async createConciliacion(data) {
    return await prisma.conciliacion.create({ data });
  },

  async updateConciliacion(id, data) {
    return await prisma.conciliacion.update({ where: { id }, data });
  },

  async deleteConciliacion(id) {
    return await prisma.conciliacion.delete({ where: { id } });
  }
};
