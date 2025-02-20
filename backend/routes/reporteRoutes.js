import express from "express";
import { ReporteBancarioService } from "../services/reporteBancarioService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reportes = await ReporteBancarioService.obtenerReportesBancarios();
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const reporte = await ReporteBancarioService.subirReporteBancario(req.body);
    res.json(reporte);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
