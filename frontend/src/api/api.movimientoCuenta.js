import { api } from "./api.config.js";

export const movimientoCuentaAPI = {
  getAllMovimientos: async () => {
    const response = await api.get("/movimiento-cuenta");
    return response.data.map(estado => ({
      ...estado,
      cuenta: estado.cuenta || { nombre: "Cuenta no encontrada" } // Asegura que siempre tenga una cuenta asociada
    }));
  },

  getMovimientoById: async (id) => {
    const response = await api.get(`/movimiento-cuenta/${id}`);
    return response.data;
  },

  createMovimiento: async (data) => {
    const response = await api.post("/movimiento-cuenta", data);
    return response.data;
  },

  deleteMovimiento: async (id) => {
    const response = await api.delete(`/movimiento-cuenta/${id}`);
    return response.data;
  },
};