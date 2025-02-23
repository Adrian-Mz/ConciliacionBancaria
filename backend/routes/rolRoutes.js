import express from "express";
import { RolService } from "../services/rolService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await RolService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rol = await RolService.getRolById(parseInt(req.params.id)); // 👈 Convierte `id` a entero
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟢 Ruta para crear un nuevo rol
router.post("/", async (req, res) => {
  try {
    const rol = await RolService.createRol(req.body);
    res.json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟢 Actualizar un rol existente
router.put("/:id", async (req, res) => {
  try {
    const rol = await RolService.updateRol(req.params.id, req.body);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟢 Eliminar un rol
router.delete("/:id", async (req, res) => {
  try {
    const rol = await RolService.deleteRol(req.params.id);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
