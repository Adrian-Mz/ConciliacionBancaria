import express from "express";
import { EstadoCuentaManualService } from "../services/estadoCuentaManualService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const estadosManuales = await EstadoCuentaManualService.getAllEstadosManuales();
    res.json(estadosManuales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const estadoManual = await EstadoCuentaManualService.createEstadoManual(req.body);
    res.json(estadoManual);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const estadoManual = await EstadoCuentaManualService.updateEstadoManual(parseInt(req.params.id), req.body);
    res.json(estadoManual);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const estadoManual = await EstadoCuentaManualService.deleteEstadoManual(parseInt(req.params.id));
    res.json(estadoManual);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;