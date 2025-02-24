import { ConciliacionData } from "../data/conciliacionData.js";

export const ConciliacionService = {
  async getAllConciliaciones() {
    return await ConciliacionData.getAllConciliaciones();
  },

  async getConciliacionById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await ConciliacionData.getConciliacionById(id);
  },

  async generarConciliacion(data) {  
    if (!data.usuarioId || !data.fecha || !data.estadoId || !data.detallesConciliacion) {
      throw new Error("Faltan datos obligatorios");
    }
  
    return await ConciliacionData.createConciliacion({
      ...data,
      detallesConciliacion: {
        create: data.detallesConciliacion.map(detalle => ({
          estadoManualId: detalle.estadoManualId,
          detalleReporteId: detalle.detalleReporteId,
          estadoId: detalle.estadoId
        }))
      }
    });
  },

  async actualizarEstadoConciliacion(id, estado, usuarioId, rol, observaciones = null) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
  
    const conciliacion = await ConciliacionData.getConciliacionById(id);
    if (!conciliacion) throw new Error("Conciliación no encontrada");

    if (rol === "Auditor" && conciliacion.estadoId !== 1) {
      throw new Error("Solo conciliaciones en estado 'Pendiente de Revisión' pueden ser revisadas por el Auditor");
    }

    if (rol === "Director Contable" && conciliacion.estadoId !== 2) {
      throw new Error("Solo conciliaciones aprobadas por el Auditor pueden ser revisadas por el Director");
    }

    return await ConciliacionData.updateConciliacion(id, { estadoId: estado, observaciones, auditorId: usuarioId });
  },

  async getConciliacionesPorEstado(estadoId) {
    return await ConciliacionData.getConciliacionesPorEstado(estadoId);
  }
};
