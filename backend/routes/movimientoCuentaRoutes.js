import express from "express";
import { MovimientosCuentaService } from "../services/movimientoCuentaService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movimientos = await MovimientosCuentaService.getAllMovimientos();
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movimiento = await MovimientosCuentaService.getMovimientoById(parseInt(req.params.id));
    res.json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const movimiento = await MovimientosCuentaService.createMovimiento(req.body);
    res.json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const movimiento = await MovimientosCuentaService.updateMovimiento(parseInt(req.params.id), req.body);
    res.json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movimiento = await MovimientosCuentaService.deleteMovimiento(parseInt(req.params.id));
    res.json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
