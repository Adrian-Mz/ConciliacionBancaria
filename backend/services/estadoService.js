import { EstadoData } from "../data/estadoData.js";

export const EstadoService = {
  async getAllEstados() {
    return await EstadoData.getAllEstados();
  },

  async getEstadoById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await EstadoData.getEstadoById(id);
  },

  async createEstado(data) {
    if (!data.nombre) throw new Error("El nombre del estado es obligatorio");
    return await EstadoData.createEstado(data);
  }
};
