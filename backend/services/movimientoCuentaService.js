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

    // 🔹 1. Obtener el saldo actual de la cuenta bancaria
    const cuenta = await prisma.cuentaBancaria.findUnique({
      where: { id: data.cuentaId },
      select: { saldo: true },
    });

    if (!cuenta) throw new Error("Cuenta bancaria no encontrada.");

    let saldoActual = Number(cuenta.saldo) || 0;

    // 🔹 2. Ordenar los detalles por `fechaOperacion`
    data.detalles.sort((a, b) => new Date(a.fechaOperacion) - new Date(b.fechaOperacion));

    // 🔹 3. Validar fechas y calcular saldo dinámico
    const detallesConSaldo = data.detalles.map((detalle) => {
      const fechaOperacion = new Date(detalle.fechaOperacion);
      const fechaHoy = new Date();

      if (fechaOperacion > fechaHoy) {
        throw new Error(`La fecha de operación (${detalle.fechaOperacion}) no puede ser futura.`);
      }

      const importe = Number(detalle.importe) || 0;
      saldoActual += importe;

      return {
        fechaOperacion,
        fechaValor: new Date(detalle.fechaValor),
        concepto: detalle.concepto,
        importe,
        saldo: saldoActual,
      };
    });

    // 🔹 4. Crear el grupo de movimiento sin repetir campos
    const nuevoMovimiento = await prisma.movimientosCuenta.create({
      data: {
        cuentaId: data.cuentaId,
        usuarioId: data.usuarioId,
        detalles: {
          create: detallesConSaldo,
        },
      },
      include: { detalles: true },
    });

    // 🔹 5. Actualizar el saldo de la cuenta bancaria
    await prisma.cuentaBancaria.update({
      where: { id: data.cuentaId },
      data: { saldo: saldoActual },
    });

    return nuevoMovimiento;
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
