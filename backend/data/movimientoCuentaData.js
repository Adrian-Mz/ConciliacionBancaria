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

  async getSaldoAnterior(cuentaId) {
    const ultimoMovimiento = await prisma.movimientoDetalle.findFirst({
      where: { movimiento: { cuentaId } },
      orderBy: { fechaOperacion: 'desc' },
      select: { saldoFinal: true }
    });
    
    console.log("🔍 Último Movimiento encontrado:", ultimoMovimiento);
    
    return ultimoMovimiento ? Number(ultimoMovimiento.saldoFinal) || 0 : 0;    
  },

  async createMovimiento(data) {
    const saldoAnterior = await this.getSaldoAnterior(data.cuentaId);

    return await prisma.movimientosCuenta.create({
      data: {
        cuentaId: data.cuentaId,
        usuarioId: data.usuarioId,
        detalles: {
          create: data.detalles.map((detalle, index) => {
            const saldoPrevio = index === 0 ? saldoActual : (detallesConSaldo[index - 1]?.saldo ?? saldoActual);
            
            return {
              fechaOperacion: new Date(detalle.fechaOperacion),
              fechaValor: new Date(detalle.fechaValor),
              concepto: detalle.concepto,
              importe: Number(detalle.importe),
              saldoAnterior: saldoPrevio,
              saldoFinal: saldoPrevio + Number(detalle.importe)
            };
          })
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
