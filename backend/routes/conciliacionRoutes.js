import express from "express";
import { ConciliacionService } from "../services/conciliacionService.js";
import { ReporteService } from "../services/reporteService.js"; // ✅ Importación para generación de PDF
import { DetalleConciliacionData } from "../data/detalleConciliacionData.js"; 

const router = express.Router();

// ✅ Obtener todas las conciliaciones
router.get("/", async (req, res) => {
  try {
    const conciliaciones = await ConciliacionService.getAllConciliaciones();
    res.json(conciliaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Obtener una conciliación por ID
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

// ✅ Crear una nueva conciliación (solo Contador)
router.post("/", async (req, res) => {
  try {
    const conciliacion = await ConciliacionService.generarConciliacion(req.body);
    res.json(conciliacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Actualizar conciliación (Contador puede modificarla si está en estado Pendiente)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conciliacionActualizada = await ConciliacionService.actualizarConciliacion(parseInt(id), req.body);
    res.json(conciliacionActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Actualizar estado de la conciliación (Solo Auditor o Director)
router.put("/estado/:id", async (req, res) => {
  try {
    const { estado, usuarioId, rol, observaciones } = req.body;

    if (!["Auditor", "Director"].includes(rol)) {
      return res.status(403).json({ error: "No tienes permisos para cambiar el estado de la conciliación" });
    }

    const conciliacion = await ConciliacionService.actualizarEstadoConciliacion(
      parseInt(req.params.id), estado, usuarioId, rol, observaciones
    );

    res.json(conciliacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Actualizar un detalle de conciliación (si es necesario corregir un valor)
router.put("/detalle/:id", async (req, res) => {
  try {
    const detalle = await DetalleConciliacionData.updateDetalleConciliacion(parseInt(req.params.id), req.body);
    res.json(detalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Generar reporte de conciliación en PDF
router.get("/reporte/:id", async (req, res) => {
  try {
    const { filename } = await ReporteService.generarPDFConciliacion(parseInt(req.params.id));
    res.download(`./public/reports/${filename}`);
  } catch (error) {
    res.status(500).json({ error: "Error al generar el reporte" });
  }
});

export default router;
