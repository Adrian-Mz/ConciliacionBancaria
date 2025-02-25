import prisma from "./prisma.js";
 
export const ConciliacionData = {
  async getAllConciliaciones() {
    return await prisma.conciliacion.findMany({
      include: {
        usuario: true,
        estado: true,
        cuenta: true,
        conciliacionesDetalles: {
          include: { libroMayor: true, movimientoCuenta: true },
        },
      },
    });
  },
 
  async getConciliacionById(id) {
    return await prisma.conciliacion.findUnique({
        where: { id },
        include: {
            usuario: true,
            estado: true,
            cuenta: true,
            conciliacionesDetalles: {
                include: {
                    libroMayor: true,
                    movimientoCuenta: true
                },
                where: {
                    OR: [
                        { libroMayorId: { not: null } },
                        { movimientoCuentaId: { not: null } }
                    ]
                }
            },
        },
    });
  },
 
 
  async getMovimientosYLibrosMayor(cuentaId, inicioMes, finMes) {
    const movimientos = await prisma.movimientosCuenta.findMany({
      where: {
        cuentaId,
        createdAt: { gte: inicioMes, lte: finMes },
      },
      include: { detalles: true },
    });
 
    const librosMayor = await prisma.libroMayor.findMany({
      where: {
        cuentaId,
        fechaOperacion: { gte: inicioMes, lte: finMes },
      },
    });
 
    return { movimientos, librosMayor };
  },
 
  async createConciliacion(data) {
    return await prisma.conciliacion.create({
      data,
      include: {
        conciliacionesDetalles: true,
      },
    });
  },
 
  async updateConciliacion(id, data) {
    return await prisma.conciliacion.update({ where: { id }, data });
  },
};