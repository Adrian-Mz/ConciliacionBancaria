import express from "express";
import { CuentaBancariaService } from "../services/cuentaBancariaService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cuentas = await CuentaBancariaService.getAllCuentas();
    res.json(cuentas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const cuenta = await CuentaBancariaService.createCuenta(req.body);
    res.json(cuenta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
