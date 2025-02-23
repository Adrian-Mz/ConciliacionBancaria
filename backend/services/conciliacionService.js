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
  

  async actualizarConciliacion(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
  
    // Verificar si la conciliación existe
    const conciliacion = await ConciliacionData.getConciliacionById(id);
    if (!conciliacion) throw new Error("Conciliación no encontrada");
  
    // Actualizar la conciliación
    return await ConciliacionData.updateConciliacion(id, data);
  }
  
};
