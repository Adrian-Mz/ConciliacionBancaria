import prisma from "./prisma.js";
 
export const LibroMayorData = {
  async getAllLibros() {
    return await prisma.libroMayor.findMany({
        include: {
            cuenta: true,  // ✅ Incluir detalles de la cuenta bancaria
            usuario: true, // ✅ Incluir información del usuario
        },
        orderBy: {
            fechaOperacion: "asc", // ✅ Ordenar por fecha
        },
    });
  },
 
 
  async getLibroById(cuentaId) {
    return await prisma.libroMayor.findMany({
        where: { cuentaId },
        include: {
            cuenta: true,
            usuario: true,
        },
        orderBy: {
            fechaOperacion: "asc",
        },
    });
  },
 
  async createLibro(data) {
    return await prisma.libroMayor.create({
      data: {
        cuentaId: data.cuentaId,
        usuarioId: data.usuarioId,
        fechaOperacion: new Date(data.fechaOperacion),
        descripcion: data.descripcion,
        debe: data.debe ? Number(data.debe) : 0,
        haber: data.haber ? Number(data.haber) : 0,
        saldoAnterior: Number(data.saldoAnterior),
        saldoFinal: Number(data.saldoFinal),
      },
    });
  },
 
  async updateLibro(id, data) {
    return await prisma.libroMayor.update({
      where: { id },
      data: {
        fechaOperacion: new Date(data.fechaOperacion),
        descripcion: data.descripcion,
        debe: data.debe ? Number(data.debe) : 0,
        haber: data.haber ? Number(data.haber) : 0,
        saldoFinal: Number(data.saldoFinal),
      },
    });
  },
 
  async deleteLibro(id) {
    return await prisma.libroMayor.delete({ where: { id } });
  },
};