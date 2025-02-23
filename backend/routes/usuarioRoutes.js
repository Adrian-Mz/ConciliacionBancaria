import express from "express";
import { UsuarioService } from "../services/usuarioService.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await UsuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await UsuarioService.getUsuarioById(parseInt(req.params.id));
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const usuario = await UsuarioService.createUsuario(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const usuario = await UsuarioService.updateUsuario(parseInt(req.params.id), req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    await UsuarioService.deleteUsuario(parseInt(req.params.id));
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
