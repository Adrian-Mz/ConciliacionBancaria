import { LibroMayorData } from "../data/libroMayorData.js";
import prisma from "../data/prisma.js";
 
export const LibroMayorService = {
  async getAllLibros() {
    return await LibroMayorData.getAllLibros();
  },
 
  async getLibroById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido.");
    return await LibroMayorData.getLibroById(id);
  },
 
  async createLibro(data) {
    if (!data.cuentaId || !data.usuarioId || !data.fechaOperacion || !data.descripcion) {
      throw new Error("Todos los campos son obligatorios.");
    }
 
    return await prisma.$transaction(async (tx) => {
      // 🔹 1. Obtener la cuenta bancaria asociada
      const cuenta = await tx.cuentaBancaria.findUnique({
        where: { id: data.cuentaId },
        select: { saldoLibro: true }, // ✅ Obtenemos saldoLibro
      });
   
      if (!cuenta) {
        throw new Error("Cuenta bancaria no encontrada.");
      }
   
      // 🔹 2. Obtener el último saldo registrado en el libro mayor
      const ultimoRegistro = await tx.libroMayor.findFirst({
        where: { cuentaId: data.cuentaId },
        orderBy: { id: "desc" }, // ✅ Se usa "id" en orden descendente para obtener el más reciente
        select: { saldoFinal: true }, // ✅ Traemos saldoFinal del último registro
      });
   
      // 🔹 3. Si hay un registro previo, el saldoAnterior debe ser el saldoFinal del último movimiento
      let saldoAnterior;
      if (ultimoRegistro) {
        saldoAnterior = Number(ultimoRegistro.saldoFinal);
      } else {
        saldoAnterior = Number(cuenta.saldoLibro) || 0; // Si no hay registros, usar saldoLibro
      }
   
      // 🔹 4. Aplicar la lógica de Debe y Haber
      const debe = Number(data.debe) || 0;
      const haber = Number(data.haber) || 0;
   
      // 🔹 5. Calcular correctamente el saldoFinal
      const saldoFinal = saldoAnterior + debe - haber; // ✅ Ahora sí se actualiza correctamente
   
      console.log(`🔍 Saldo Anterior: ${saldoAnterior}, Debe: ${debe}, Haber: ${haber}, Saldo Final: ${saldoFinal}`);
   
      // 🔹 6. Crear el nuevo registro en el Libro Mayor con los valores corregidos
      const nuevoLibro = await tx.libroMayor.create({
        data: {
          cuentaId: data.cuentaId,
          usuarioId: data.usuarioId,
          fechaOperacion: new Date(data.fechaOperacion),
          descripcion: data.descripcion,
          debe,
          haber,
          saldoAnterior, // ✅ Ahora toma el saldo final del último movimiento
          saldoFinal,
        },
      });
   
      // 🔹 7. Actualizar saldoLibro en la cuenta bancaria
      await tx.cuentaBancaria.update({
        where: { id: data.cuentaId },
        data: { saldoLibro: saldoFinal }, // ✅ Ahora se actualiza correctamente
      });
   
      return nuevoLibro;
    });
   
   
  },
 
  async updateLibro(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido.");
    return await LibroMayorData.updateLibro(id, data);
  },
 
  async deleteLibro(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido.");
    return await LibroMayorData.deleteLibro(id);
  },
};