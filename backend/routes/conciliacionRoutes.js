import express from "express";
import { ConciliacionService } from "../services/conciliacionService.js";  // ✅ Asegúrate de importar con .js

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conciliaciones = await ConciliacionService.getAllConciliaciones();
    res.json(conciliaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const conciliacion = await ConciliacionService.generarConciliacion(req.body);  // ✅ Verifica que la función sea llamada correctamente
    res.json(conciliacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
