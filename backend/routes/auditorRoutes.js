import express from "express";
import { AuditorService } from "../services/auditorService.js";

const router = express.Router();

router.put("/correcto/:id", async (req, res) => {
  try {
    const resultado = await AuditorService.marcarTransaccionComoCorrecta(parseInt(req.params.id));
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
