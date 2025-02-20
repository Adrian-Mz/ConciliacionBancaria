import { ConciliacionData } from "../data/conciliacionData.js";

export const DirectorService = {
  async aprobarConciliacion(conciliacionId) {
    return await ConciliacionData.updateConciliacion(conciliacionId, { estadoId: 5 });
  }
};
