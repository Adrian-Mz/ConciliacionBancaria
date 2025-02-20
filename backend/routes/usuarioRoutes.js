import express from "express";
import { UsuarioService } from "../services/usuarioService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const usuarios = await UsuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const usuario = await UsuarioService.getUsuarioById(parseInt(req.params.id));
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const usuario = await UsuarioService.createUsuario(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
