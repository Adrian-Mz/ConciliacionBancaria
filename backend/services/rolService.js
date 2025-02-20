import { RolData } from "../data/rolData.js";

export const RolService = {
  async getAllRoles() {
    return await RolData.getAllRoles();
  },

  async getRolById(id) {
    if (!id || isNaN(id)) throw new Error("ID de rol inválido");
    return await RolData.getRolById(id);
  },

  async createRol(data) {
    if (!data.nombre) throw new Error("El nombre del rol es obligatorio");
    return await RolData.createRol(data);
  }
};
