import { LibroMayorData } from "../data/libroMayorData.js";
import prisma from "../data/prisma.js";
 
export const LibroMayorService = {
  async getAllLibros() {
    return await prisma.libroMayor.findMany({
        include: {
            cuenta: true,  // ✅ Incluir detalles de la cuenta
            usuario: true, // ✅ Incluir detalles del usuario
        },
        orderBy: {
            fechaOperacion: "asc", // ✅ Ordenar por fecha
        },
    });
  },
 
 
  async getLibroById(cuentaId) {
    if (!cuentaId || isNaN(cuentaId)) throw new Error("ID de cuenta inválido.");
   
    // 🔹 Traer todos los registros asociados a la cuenta bancaria
    const libros = await prisma.libroMayor.findMany({
        where: { cuentaId },
        include: {
            cuenta: true,
            usuario: true,
        },
        orderBy: {
            fechaOperacion: "asc",
        },
    });
 
    if (!libros || libros.length === 0) {
        throw new Error("No se encontraron registros en el Libro Mayor para esta cuenta.");
    }
 
    return libros;
  },
 
 
  async createLibro(data) {
    // 🔹 Validar si data es un array o un solo objeto
    const registros = Array.isArray(data) ? data : [data];
 
    return await prisma.$transaction(async (tx) => {
      const resultados = [];
 
      for (const registro of registros) {
        if (!registro.cuentaId || !registro.usuarioId || !registro.fechaOperacion || !registro.descripcion) {
          throw new Error("Todos los campos son obligatorios.");
        }
 
        // 🔹 Obtener la cuenta bancaria asociada
        const cuenta = await tx.cuentaBancaria.findUnique({
          where: { id: registro.cuentaId },
          select: { saldo: true, saldoLibro: true },
        });
 
        if (!cuenta) {
          throw new Error("Cuenta bancaria no encontrada.");
        }
 
        // 🔹 Obtener el último saldo registrado en el libro mayor
        const ultimoRegistro = await tx.libroMayor.findFirst({
          where: { cuentaId: registro.cuentaId },
          orderBy: { createdAt: "desc" },
          select: { saldoFinal: true },
        });
 
        // 🔹 Determinar el saldo inicial correcto
        let saldoAnterior = ultimoRegistro ? Number(ultimoRegistro.saldoFinal) : Number(cuenta.saldo);
 
        // 🔹 Aplicar la lógica de Debe y Haber
        const debe = Number(registro.debe) || 0;
        const haber = Number(registro.haber) || 0;
 
        // 🔹 Calcular el saldo final
        const saldoFinal = saldoAnterior + debe - haber;
 
        console.log(`🔍 [Registro ${registro.descripcion}] Saldo Anterior: ${saldoAnterior}, Debe: ${debe}, Haber: ${haber}, Saldo Final: ${saldoFinal}`);
 
        // 🔹 Crear el nuevo registro en el Libro Mayor
        const nuevoLibro = await tx.libroMayor.create({
          data: {
            cuentaId: registro.cuentaId,
            usuarioId: registro.usuarioId,
            fechaOperacion: new Date(registro.fechaOperacion),
            descripcion: registro.descripcion,
            debe,
            haber,
            saldoAnterior,
            saldoFinal,
          },
        });
 
        resultados.push(nuevoLibro);
       
        // 🔹 Actualizar saldoLibro en la cuenta bancaria
        await tx.cuentaBancaria.update({
          where: { id: registro.cuentaId },
          data: { saldoLibro: saldoFinal },
        });
      }
 
      return { message: "Registros insertados correctamente.", registros: resultados.length, data: resultados };
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