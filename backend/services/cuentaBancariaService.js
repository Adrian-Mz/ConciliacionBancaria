import { CuentaBancariaData } from "../data/cuentaBancariaData.js";
import prisma from "../data/prisma.js";
 
export const CuentaBancariaService = {
  async getAllCuentas() {
    return await CuentaBancariaData.getAllCuentas();
  },
 
  async getCuentaById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await CuentaBancariaData.getCuentaById(id);
  },
 
  async createCuenta(data) {
    if (!data.nombre || !data.numero || !data.banco || !data.usuarioId || data.saldo === undefined) {
      throw new Error("Todos los campos son obligatorios.");
    }
 
    // Verificar si el número de cuenta ya existe
    const cuentaExistente = await CuentaBancariaData.getCuentaByNumero(data.numero);
    if (cuentaExistente) {
      throw new Error("El número de cuenta ya está en uso.");
    }
 
    return await CuentaBancariaData.createCuenta({
      nombre: data.nombre,
      numero: data.numero,
      banco: data.banco,
      usuarioId: data.usuarioId,
      saldo: data.saldo // ✅ Solo se almacena el saldo
    });
  },  
 
 
  async updateCuenta(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await CuentaBancariaData.updateCuenta(id, data);
  },
 
  async deleteCuenta(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido.");
 
    return await prisma.$transaction(async (tx) => {
        // 🔹 1. Verificar si la cuenta existe
        const cuenta = await tx.cuentaBancaria.findUnique({
            where: { id },
            include: {
                movimientos: { select: { id: true } },
                librosMayor: { select: { id: true } }
            }
        });
 
        if (!cuenta) {
            throw new Error("Cuenta bancaria no encontrada.");
        }
 
        // 🔹 2. Eliminar la cuenta (y automáticamente sus movimientos y libros mayor)
        await tx.cuentaBancaria.delete({ where: { id } });
 
        console.log(`✅ Cuenta eliminada junto con sus movimientos y registros en el libro mayor.`);
 
        return { message: "Cuenta bancaria eliminada correctamente." };
    });
  }
};