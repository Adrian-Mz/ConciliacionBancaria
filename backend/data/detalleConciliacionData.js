import prisma from "./prisma.js";

export const DetalleConciliacionData = {
  async getAllDetallesConciliacion() {
    return await prisma.detalleConciliacion.findMany({ 
      include: { estadoManual: true, detalleReporte: true, estado: true } 
    });
  },

  async updateDetalleConciliacion(id, data) {
    return await prisma.detalleConciliacion.update({
      where: { id },
      data,
    });
  }
};
