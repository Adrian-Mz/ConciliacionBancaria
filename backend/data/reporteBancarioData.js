import prisma from "./prisma.js";

export const ReporteBancarioData = {
  async getAllReportes() {
    return await prisma.reporteBancario.findMany({ include: { usuario: true, estado: true } });
  },

  async getReporteById(id) {
    return await prisma.reporteBancario.findUnique({ where: { id }, include: { usuario: true, estado: true } });
  },

  async createReporte(data) {
    return await prisma.reporteBancario.create({ data });
  },

  async updateReporte(id, data) {
    return await prisma.reporteBancario.update({ where: { id }, data });
  },

  async deleteReporte(id) {
    return await prisma.reporteBancario.delete({ where: { id } });
  }
};
