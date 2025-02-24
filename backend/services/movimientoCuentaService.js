import { MovimientosCuentaData } from "../data/movimientoCuentaData.js";
import prisma from "../data/prisma.js";
 
export const MovimientosCuentaService = {
  async getAllMovimientos() {
    return await MovimientosCuentaData.getAllMovimientos();
  },
 
  async getMovimientoById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await MovimientosCuentaData.getMovimientoById(id);
  },
 
  async createMovimiento(data) {
    if (!data.cuentaId || !data.usuarioId || !data.detalles || !Array.isArray(data.detalles) || data.detalles.length === 0) {
      throw new Error("Todos los campos del movimiento son obligatorios y debe haber al menos un detalle.");
    }
 
    return await prisma.$transaction(async (tx) => {
      // 🔹 1. Obtener el saldo actual de la cuenta bancaria
      const cuenta = await tx.cuentaBancaria.findUnique({
        where: { id: data.cuentaId },
        select: { saldoBanco: true }, // ✅ Seleccionamos solo saldoBanco
      });
 
      if (!cuenta) {
        throw new Error(`Cuenta bancaria con ID ${data.cuentaId} no encontrada.`);
      }
 
      let saldoActual = Number(cuenta.saldoBanco) || 0; // ✅ Usar saldoBanco en lugar de saldo
 
      // 🔹 2. Ordenar los detalles por `fechaOperacion`
      data.detalles.sort((a, b) => new Date(a.fechaOperacion) - new Date(b.fechaOperacion));
 
      // 🔹 3. Validar fechas y calcular saldo dinámico
      let detallesConSaldo = [];
 
      detallesConSaldo = data.detalles.map((detalle, index) => {
        if (!detalle.fechaOperacion || !detalle.fechaValor || !detalle.concepto || detalle.importe === undefined) {
          throw new Error("Todos los campos de los detalles son obligatorios.");
        }
 
        const fechaOperacion = new Date(detalle.fechaOperacion);
        const fechaHoy = new Date();
 
        if (fechaOperacion > fechaHoy) {
          throw new Error(`La fecha de operación (${detalle.fechaOperacion}) no puede ser futura.`);
        }
 
        const importe = Number(detalle.importe) || 0;
        const saldoPrevio = index === 0 ? saldoActual : detallesConSaldo[index - 1]?.saldoFinal || saldoActual;
 
        console.log(`🔹 Detalle ${index + 1}:`, detalle);
        console.log(`➡️ Saldo Previo: ${saldoPrevio}`);
 
        saldoActual = saldoPrevio + importe;
 
        return {
          fechaOperacion,
          fechaValor: new Date(detalle.fechaValor),
          concepto: detalle.concepto,
          importe,
          saldoAnterior: saldoPrevio, // ✅ Usar saldoAnterior en lugar de saldo
          saldoFinal: saldoActual, // ✅ Usar saldoFinal en lugar de saldo
        };
      });
 
      // 🔹 4. Crear el movimiento y detalles en la BD
      const nuevoMovimiento = await tx.movimientosCuenta.create({
        data: {
          cuentaId: data.cuentaId,
          usuarioId: data.usuarioId,
          detalles: {
            create: detallesConSaldo, // ✅ Prisma solo guarda los detalles aquí
          },
        },
        include: { detalles: true },
      });
 
      // 🔹 5. Actualizar el saldoBanco de la cuenta bancaria
      await tx.cuentaBancaria.update({
        where: { id: data.cuentaId },
        data: { saldoBanco: saldoActual }, // ✅ Ahora actualiza saldoBanco, no saldo
      });
 
      return nuevoMovimiento;
    });
  },
 
  async updateMovimiento(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await MovimientosCuentaData.updateMovimiento(id, data);
  },
 
  async deleteMovimiento(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await MovimientosCuentaData.deleteMovimiento(id);
  }
};