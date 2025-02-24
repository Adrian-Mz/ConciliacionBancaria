import { LibroMayorData } from "../data/libroMayorData.js";
import { CuentaBancariaData } from "../data/cuentaBancariaData.js";

export const LibroMayorService = {
  async getAllLibros() {
    return await LibroMayorData.getAllLibros();
  },

  async getLibroById(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido.");
    return await LibroMayorData.getLibroById(id);
  },

  async createLibro(data) {
    if (!data.cuentaId || !data.usuarioId || !data.fechaOperacion || !data.descripcion) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Obtener la cuenta bancaria asociada
    const cuenta = await CuentaBancariaData.getCuentaById(data.cuentaId);
    if (!cuenta) throw new Error("Cuenta bancaria no encontrada.");

    // Obtener el último saldo registrado (saldo final del mes anterior)
    const ultimoRegistro = await LibroMayorData.getLastLibroByCuenta(data.cuentaId);
    const saldoAnterior = ultimoRegistro ? ultimoRegistro.saldoFinal : cuenta.saldo;

    // Calcular saldo final
    const saldoFinal = saldoAnterior + (data.credito ? Number(data.credito) : 0) - (data.debito ? Number(data.debito) : 0);

    // Crear el registro en libro mayor
    return await LibroMayorData.createLibro({
      ...data,
      saldoAnterior,
      saldoFinal,
    });
  },

  async updateLibro(id, data) {
    return await LibroMayorData.updateLibro(id, data);
  },

  async deleteLibro(id) {
    return await LibroMayorData.deleteLibro(id);
  },
};
