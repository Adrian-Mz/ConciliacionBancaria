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

router.get("/:id", async (req, res) => {
  try {
    const conciliacion = await ConciliacionService.getConciliacionById(parseInt(req.params.id));
    if (!conciliacion) {
      return res.status(404).json({ error: "Conciliación no encontrada" });
    }
    res.json(conciliacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conciliacionActualizada = await ConciliacionService.actualizarConciliacion(parseInt(id), req.body);
    res.json(conciliacionActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/detalle/:id", async (req, res) => {
  try {
    const detalle = await DetalleConciliacionData.updateDetalleConciliacion(req.params.id, req.body);
    res.json(detalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;
