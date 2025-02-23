import prisma from "./prisma.js";

export const RolData = {
  async getAllRoles() {
    return await prisma.rol.findMany();
  },

  async getRolById(id) {
    return await prisma.rol.findUnique({ where: { id } });
  },

  async createRol(data) {
    return await prisma.rol.create({ data });
  },

  async updateRol(id, data) {
    return await prisma.rol.update({
      where: { id: parseInt(id) }, // 👈 Convierte `id` a número
      data,
    });
  },


  // 🟢 Eliminar un rol por su ID
  async deleteRol(id) {
    return await prisma.rol.delete({
      where: { id },
    });
  },
};
