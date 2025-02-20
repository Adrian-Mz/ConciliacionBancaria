import express from "express";
import { TransaccionContableService } from "../services/transaccionContableService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const transacciones = await TransaccionContableService.getAllTransacciones();
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const transaccion = await TransaccionContableService.createTransaccion(req.body);
    res.json(transaccion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
