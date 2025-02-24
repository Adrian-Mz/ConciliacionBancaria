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
    if (!data.nombre || !data.numero || !data.banco || !data.usuarioId || data.saldo === undefined) {
      throw new Error("Todos los campos son obligatorios.");
    }
 
    // Verificar si el número de cuenta ya existe
    const cuentaExistente = await CuentaBancariaData.getCuentaByNumero(data.numero);
    if (cuentaExistente) {
      throw new Error("El número de cuenta ya está en uso.");
    }
 
    return await CuentaBancariaData.createCuenta({
      nombre: data.nombre,
      numero: data.numero,
      banco: data.banco,
      usuarioId: data.usuarioId,
      saldo: data.saldo // ✅ Solo se almacena el saldo
    });
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