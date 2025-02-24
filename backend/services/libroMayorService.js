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
        select: { saldo: true, saldoLibro: true }, // ✅ Obtenemos saldo y saldoLibro
      });
 
      if (!cuenta) {
        throw new Error("Cuenta bancaria no encontrada.");
      }
 
      // 🔹 2. Obtener el último saldo registrado en el libro mayor
      const ultimoRegistro = await tx.libroMayor.findFirst({
        where: { cuentaId: data.cuentaId },
        orderBy: { createdAt: "desc" }, // ✅ Obtener el más reciente
        select: { saldoFinal: true }, // ✅ Traemos saldoFinal del último registro
      });
 
      // 🔹 3. Determinar el saldo inicial correcto
      let saldoAnterior;
      if (ultimoRegistro) {
        saldoAnterior = Number(ultimoRegistro.saldoFinal); // ✅ Si hay registros previos, tomamos saldoFinal del último libro
      } else {
        saldoAnterior = Number(cuenta.saldo); // ✅ Si la cuenta es nueva, tomamos el saldo inicial de la cuenta
      }
 
      // 🔹 4. Aplicar la lógica de Debe y Haber
      const debe = Number(data.debe) || 0;
      const haber = Number(data.haber) || 0;
 
      // 🔹 5. Calcular correctamente el saldoFinal
      const saldoFinal = saldoAnterior + debe - haber; // ✅ Se actualiza correctamente con Debe y Haber
 
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
          saldoAnterior, // ✅ Se establece correctamente según la lógica
          saldoFinal,
        },
      });
 
      // 🔹 7. Actualizar saldoLibro en la cuenta bancaria
      await tx.cuentaBancaria.update({
        where: { id: data.cuentaId },
        data: { saldoLibro: saldoFinal }, // ✅ Se actualiza saldoLibro con el nuevo saldoFinal
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
 
    return await prisma.$transaction(async (tx) => {
        // 🔹 1. Obtener el libro mayor antes de eliminarlo
        const libro = await tx.libroMayor.findUnique({
            where: { id },
            include: { cuenta: { select: { saldoLibro: true } } }, // ✅ Obtener la cuenta asociada
        });
 
        if (!libro) {
            throw new Error("Registro en Libro Mayor no encontrado.");
        }
 
        const cuentaId = libro.cuentaId;
        let saldoLibroActual = Number(libro.cuenta.saldoLibro);
 
        // 🔹 2. Ajustar el saldo en la cuenta bancaria
        const saldoAjustado = saldoLibroActual - (libro.saldoFinal - libro.saldoAnterior);
 
        // 🔹 3. Eliminar el registro del libro mayor
        await tx.libroMayor.delete({ where: { id } });
 
        // 🔹 4. Actualizar saldoLibro en la cuenta bancaria
        await tx.cuentaBancaria.update({
            where: { id: cuentaId },
            data: { saldoLibro: saldoAjustado },
        });
 
        console.log(`✅ Registro eliminado y saldo actualizado: ${saldoAjustado}`);
 
        return { message: "Registro del Libro Mayor eliminado correctamente.", saldoLibroActualizado: saldoAjustado };
    });
  }
};