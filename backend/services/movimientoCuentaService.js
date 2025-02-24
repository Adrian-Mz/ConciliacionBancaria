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
        // 🔹 1. Obtener la cuenta bancaria
        const cuenta = await tx.cuentaBancaria.findUnique({
            where: { id: data.cuentaId },
            select: { saldo: true, saldoBanco: true }, // ✅ Obtenemos saldo y saldoBanco
        });
 
        if (!cuenta) {
            throw new Error("Cuenta bancaria no encontrada.");
        }
 
        // 🔹 2. Obtener el último movimiento de la cuenta (si existe)
        const ultimoMovimiento = await tx.movimientoDetalle.findFirst({
            where: { movimiento: { cuentaId: data.cuentaId } },
            orderBy: { createdAt: "desc" }, // 🔹 Obtenemos el último movimiento para tomar su saldoFinal
        });
 
        // 🔹 3. Determinar el saldo inicial a usar
        let saldoActual;
        if (ultimoMovimiento) {
            saldoActual = Number(ultimoMovimiento.saldoFinal); // ✅ Si hay movimientos previos, tomamos saldoFinal del último movimiento
        } else {
            saldoActual = Number(cuenta.saldo); // ✅ Si la cuenta es nueva, tomamos el saldo ingresado al crear la cuenta
        }
 
        // 🔹 4. Ordenar los detalles por `fechaOperacion`
        data.detalles.sort((a, b) => new Date(a.fechaOperacion) - new Date(b.fechaOperacion));
 
        // 🔹 5. Validar fechas y calcular saldo dinámico
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
                saldoAnterior: saldoPrevio, // ✅ Se toma correctamente el saldo de la cuenta si es nueva
                saldoFinal: saldoActual, // ✅ Se actualiza correctamente
            };
        });
 
        // 🔹 6. Crear el movimiento y detalles en la BD
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
 
        // 🔹 7. Actualizar saldoBanco en la cuenta bancaria (NO saldo)
        await tx.cuentaBancaria.update({
            where: { id: data.cuentaId },
            data: { saldoBanco: saldoActual }, // ✅ Se actualiza saldoBanco, NO saldo
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