import prisma from "./prisma.js";

export const MovimientosCuentaData = {
  async getAllMovimientos() {
    return await prisma.movimientosCuenta.findMany({
      include: {
        detalles: true,
        cuenta: true
      }
    });
  },

  async getMovimientoById(id) {
    return await prisma.movimientosCuenta.findUnique({
      where: { id },
      include: {
        detalles: true,
        cuenta: true
      }
    });
  },

  async createMovimiento(data) {
    return await prisma.movimientosCuenta.create({
      data: {
        cuentaId: data.cuentaId,
        usuarioId: data.usuarioId,  // ✅ Ahora usuarioId es válido
        fechaOperacion: new Date(data.detalles[0].fechaOperacion),
        fechaValor: new Date(data.detalles[0].fechaValor),
        concepto: data.detalles[0].concepto,
        importe: Number(data.detalles[0].importe),
        saldo: Number(data.detalles[0].saldo || 0),
        detalles: {
          create: data.detalles.map(detalle => ({
            fechaOperacion: new Date(detalle.fechaOperacion),
            fechaValor: new Date(detalle.fechaValor),
            concepto: detalle.concepto,
            importe: Number(detalle.importe),
            saldo: Number(detalle.saldo) || 0
          }))
        }
      },
      include: {
        detalles: true
      }
    });
  },

  async updateMovimiento(id, data) {
    return await prisma.movimientosCuenta.update({
      where: { id },
      data
    });
  },

  async deleteMovimiento(id) {
    return await prisma.movimientosCuenta.delete({
      where: { id }
    });
  }
};
