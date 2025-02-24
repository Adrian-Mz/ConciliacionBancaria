import prisma from "./prisma.js";
 
export const CuentaBancariaData = {
  async getAllCuentas() {
    return await prisma.cuentaBancaria.findMany({ include: { usuario: true } });
  },
 
  async getCuentaById(id) {
    return await prisma.cuentaBancaria.findUnique({ where: { id }, include: { usuario: true } });
  },
 
  async createCuenta(data) {
    return await prisma.cuentaBancaria.create({
      data: {
        nombre: data.nombre,
        numero: data.numero,
        banco: data.banco,
        usuarioId: data.usuarioId,
        saldo: data.saldo // ✅ Solo este campo se guarda
      }
    });
  },  
 
  async updateCuenta(id, data) {
    return await prisma.cuentaBancaria.update({ where: { id }, data });
  },
 
  async deleteCuenta(id) {
    return await prisma.cuentaBancaria.delete({ where: { id } });
  },
 
  async getCuentaByNumero(numero) {
    return await prisma.cuentaBancaria.findUnique({
      where: { numero }
    });
  }
 
};