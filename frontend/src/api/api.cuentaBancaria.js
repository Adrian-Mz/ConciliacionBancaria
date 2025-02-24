import { api } from "./api.config.js";

export const cuentaBancariaAPI = {
  getAllCuentas: async () => {
    const response = await api.get("/cuentas");
    return response.data;
  },

  getCuentaById: async (id) => {
    const response = await api.get(`/cuentas/${id}`);
    return response.data;
  },

  createCuenta: async (data) => {
    const response = await api.post("/cuentas", data);
    return response.data;
  },

  deleteCuenta: async (id) => {
    const response = await api.delete(`/cuentas/${id}`);
    return response.data;
  },
};
