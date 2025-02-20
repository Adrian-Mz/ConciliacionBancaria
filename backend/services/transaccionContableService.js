import { TransaccionContableData } from "../data/transaccionContableData.js";

export const TransaccionContableService = {
  async getAllTransacciones() {
    return await TransaccionContableData.getAllTransacciones();
  },

  async getTransaccionById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await TransaccionContableData.getTransaccionById(id);
  },

  async createTransaccion(data) {
    if (!data.fecha || !data.cuentaId || !data.valor || !data.saldo) {
      throw new Error("Datos incompletos");
    }
    return await TransaccionContableData.createTransaccion(data);
  }
};
