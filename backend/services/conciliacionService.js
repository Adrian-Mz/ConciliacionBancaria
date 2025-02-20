import { ConciliacionData } from "../data/conciliacionData.js";

export const ConciliacionService = {
  async getAllConciliaciones() {
    return await ConciliacionData.getAllConciliaciones();
  },

  async getConciliacionById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await ConciliacionData.getConciliacionById(id);
  },

  async generarConciliacion(data) {  // ✅ Verifica que esta función exista
    if (!data.usuarioId || !data.fecha || !data.estadoId) {
      throw new Error("Faltan datos obligatorios");
    }
    return await ConciliacionData.createConciliacion(data);
  }
};
