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
  }
};
