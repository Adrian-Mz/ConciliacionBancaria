import { api } from "./api.config.js";

export const conciliacionAPI = {
  getAllConciliaciones: async () => {
    try {
      const response = await api.get("/conciliaciones");
      return response.data;
    } catch (error) {
      console.error("Error al obtener conciliaciones:", error.response?.data || error.message);
      throw new Error("No se pudieron obtener las conciliaciones.");
    }
  },

  getConciliacionById: async (id) => {
    try {
      if (!id || isNaN(id)) throw new Error("ID inválido.");
      const response = await api.get(`/conciliaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la conciliación con ID ${id}:`, error.response?.data || error.message);
      throw new Error("No se pudo obtener la conciliación.");
    }
  },

  getConciliacionByCuentaId: async (id) => {
    try {
      if (!id || isNaN(id)) throw new Error("ID inválido para obtener la conciliación de la cuenta.");
      const response = await api.get(`/conciliaciones/cuenta/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error al obtener la conciliación de la cuenta con ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(`No se pudo obtener la conciliación de la cuenta con ID ${id}.`);
    }
  },

  getMovimientosParaConciliacion: async (cuentaId, mes) => {
    try {
      if (!cuentaId || !mes) throw new Error("Cuenta y mes son requeridos.");
      const response = await api.get(`/conciliaciones/movimientos/${cuentaId}/${mes}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener movimientos y libros mayor:", error.response?.data || error.message);
      throw new Error("No se pudieron obtener los datos para la conciliación.");
    }
  },

  createConciliacion: async (data) => {
    try {
      const response = await api.post("/conciliaciones/generar", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear conciliación:", error.response?.data || error.message);
      throw new Error("No se pudo crear la conciliación.");
    }
  },
};
