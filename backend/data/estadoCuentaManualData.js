import prisma from "./prisma.js";

export const EstadoCuentaManualData = {
  async getAllEstadosManuales() {
    return await prisma.estadoCuentaManual.findMany({
        include: { detalles: true } // 🔹 Incluir los detalles de cada estado manual
      });
  },

  async getEstadoManualById(id) {
    return await prisma.estadoCuentaManual.findUnique({ where: { id }, include: { usuario: true, cuenta: true } });
  },

  async createEstadoManual(data) {
    return await prisma.estadoCuentaManual.create({
      data: {
        usuarioId: data.usuarioId,
        cuentaId: data.cuentaId,
        fecha: new Date(data.fecha),
        verificado: data.verificado,
        detalles: {
          create: data.detalles
        }
      },
      include: {
        detalles: true
      }
    });
  },

  async updateEstadoManual(id, data) {
    return await prisma.estadoCuentaManual.update({ where: { id }, data });
  },

  async deleteEstadoManual(id) {
    return await prisma.estadoCuentaManual.delete({ where: { id } });
  }
};
