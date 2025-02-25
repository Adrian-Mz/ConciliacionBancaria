import { ConciliacionData } from "../data/conciliacionData.js";
import prisma from "../data/prisma.js";

export const ConciliacionService = {
  async getAllConciliaciones() {
    return await ConciliacionData.getAllConciliaciones();
  },

  async getConciliacionById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");

    return await ConciliacionData.getConciliacionById(id);
  },

  async getConciliacionByCuentaId(cuentaId) {
    if (!cuentaId || isNaN(cuentaId)) throw new Error("ID de cuenta inválido");
  
    return await prisma.conciliacion.findMany({
      where: { cuentaId },
      include: {
        usuario: true,
        estado: true,
        cuenta: true,
        conciliacionesDetalles: {
          include: { libroMayor: true, movimientoCuenta: true },
        },
      },
    });
  },

  async obtenerMovimientosParaConciliacion(cuentaId, fecha) {
    if (!cuentaId || isNaN(cuentaId)) {
      throw new Error("ID de cuenta inválido.");
    }

    const inicioMes = new Date(new Date(fecha).getFullYear(), new Date(fecha).getMonth(), 1);
    const finMes = new Date(new Date(fecha).getFullYear(), new Date(fecha).getMonth() + 1, 0);

    const { movimientos, librosMayor } = await ConciliacionData.getMovimientosYLibrosMayor(
      cuentaId,
      inicioMes,
      finMes
    );

    const detallesConciliacion = [];

    movimientos.forEach((mov) => {
      mov.detalles.forEach((detalle) => {
        detallesConciliacion.push({
          fechaOperacion: detalle.fechaOperacion,
          descripcion: detalle.concepto,
          debe: detalle.importe >= 0 ? detalle.importe : 0,
          haber: detalle.importe < 0 ? Math.abs(detalle.importe) : 0,
          tipo: "Banco",
        });
      });
    });

    librosMayor.forEach((libro) => {
      detallesConciliacion.push({
        fechaOperacion: libro.fechaOperacion,
        descripcion: libro.descripcion,
        debe: libro.debe || 0,
        haber: libro.haber || 0,
        tipo: "Libro Mayor",
      });
    });

    return detallesConciliacion;
  },

  async generarConciliacion(data) {
    const { usuarioId, cuentaId, fecha, detalles } = data;

    if (!usuarioId || !cuentaId || !fecha || !detalles || detalles.length === 0) {
        throw new Error("Faltan datos obligatorios para la conciliación.");
    }

    console.log("Recibido en el backend:", data);

    const fechaISO = new Date(fecha);

    // Transformar los detalles correctamente
    const detallesConciliacion = detalles.map((detalle) => {
        let movimientoCuentaId = null;
        let libroMayorId = null;

        // 🔹 Asignar correctamente a `movimientoCuentaId` o `libroMayorId`
        if (detalle.tipo === "Banco") {
            movimientoCuentaId = detalle.id; // Relacionar con MovimientosCuenta
        } else if (detalle.tipo === "Libro Mayor") {
            libroMayorId = detalle.id; // Relacionar con LibroMayor
        }

        return {
            estadoId: 1, // Estado inicial "Pendiente"
            movimientoCuentaId,
            libroMayorId,
        };
    });

    console.log("Detalles generados para la conciliación:", detallesConciliacion);

    return await prisma.conciliacion.create({
        data: {
            usuarioId,
            cuentaId,
            fecha: fechaISO,
            estadoId: 1,
            conciliacionesDetalles: {
                create: detallesConciliacion,
            },
        },
    });
  }
};
