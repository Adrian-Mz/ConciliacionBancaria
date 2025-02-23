import { EstadoCuentaManualData } from "../data/estadoCuentaManualData.js";

export const EstadoCuentaManualService = {
  async getAllEstadosManuales() {
    return await EstadoCuentaManualData.getAllEstadosManuales();
  },

  async getEstadoManualById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await EstadoCuentaManualData.getEstadoManualById(id);
  },

  async createEstadoManual(data) {
    if (!data.cuentaId || !data.usuarioId || !data.fecha || data.verificado === undefined || !data.detalles) {
      throw new Error("Todos los campos son obligatorios");
    }
  
    if (!Array.isArray(data.detalles) || data.detalles.length === 0) {
      throw new Error("Los detalles deben ser un array con al menos un elemento");
    }
  
    return await EstadoCuentaManualData.createEstadoManual(data);
  },

  async updateEstadoManual(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await EstadoCuentaManualData.updateEstadoManual(id, data);
  },

  async deleteEstadoManual(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await EstadoCuentaManualData.deleteEstadoManual(id);
  }
};
