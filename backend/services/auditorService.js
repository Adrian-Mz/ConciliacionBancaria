import { ConciliacionData } from "../data/conciliacionData.js";

export const AuditorService = {
  async marcarTransaccionComoCorrecta(detalleConciliacionId) {
    return await ConciliacionData.updateDetalleConciliacion(detalleConciliacionId, { estadoId: 2 });
  },

  async enviarConciliacionARevision(conciliacionId) {
    return await ConciliacionData.updateConciliacion(conciliacionId, { estadoId: 4 });
  }
};
