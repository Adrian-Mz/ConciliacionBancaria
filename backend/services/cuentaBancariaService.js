import { CuentaBancariaData } from "../data/cuentaBancariaData.js";

export const CuentaBancariaService = {
  async getAllCuentas() {
    return await CuentaBancariaData.getAllCuentas();
  },

  async getCuentaById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await CuentaBancariaData.getCuentaById(id);
  },

  async createCuenta(data) {
    if (!data.nombre || !data.numero || !data.banco || !data.usuarioId || !data.saldo) {
      throw new Error("Todos los campos son obligatorios");
    }
    return await CuentaBancariaData.createCuenta(data);
  },

  async updateCuenta(id, data) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await CuentaBancariaData.updateCuenta(id, data);
  },

  async deleteCuenta(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    return await CuentaBancariaData.deleteCuenta(id);
  }
};
