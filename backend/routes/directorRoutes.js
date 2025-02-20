import express from "express";
import { DirectorService } from "../services/directorService.js";

const router = express.Router();

router.put("/aprobar/:id", async (req, res) => {
  try {
    const resultado = await DirectorService.aprobarConciliacion(parseInt(req.params.id));
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
