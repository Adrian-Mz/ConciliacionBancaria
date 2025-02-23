import express from "express";
import { EstadoService } from "../services/estadoService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const estados = await EstadoService.getAllEstados();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const estado = await EstadoService.createEstado(req.body);
    res.json(estado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
