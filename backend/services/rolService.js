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
  },

  async updateRol(id, data) {
    const rolId = parseInt(id);  // 👈 Convierte `id` a número
    if (!rolId || isNaN(rolId)) throw new Error("ID de rol inválido");
    if (!data.nombre) throw new Error("El nombre del rol es obligatorio");

    const rol = await RolData.getRolById(rolId);
    if (!rol) throw new Error("Rol no encontrado");

    return await RolData.updateRol(rolId, data);
  },

  
  // 🟢 Eliminar un rol por su ID
  async deleteRol(id) {
    if (!id || isNaN(id)) throw new Error("ID de rol inválido");

    const rol = await RolData.getRolById(id);
    if (!rol) throw new Error("Rol no encontrado");

    return await RolData.deleteRol(id);
  },
};
