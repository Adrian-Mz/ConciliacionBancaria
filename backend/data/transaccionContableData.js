import prisma from "./prisma.js";

export const TransaccionContableData = {
  async getAllTransacciones() {
    return await prisma.transaccionContable.findMany({ include: { cuenta: true } });
  },

  async getTransaccionById(id) {
    return await prisma.transaccionContable.findUnique({ where: { id }, include: { cuenta: true } });
  },

  async createTransaccion(data) {
    return await prisma.transaccionContable.create({ data });
  },

  async updateTransaccion(id, data) {
    return await prisma.transaccionContable.update({ where: { id }, data });
  },

  async deleteTransaccion(id) {
    return await prisma.transaccionContable.delete({ where: { id } });
  }
};
