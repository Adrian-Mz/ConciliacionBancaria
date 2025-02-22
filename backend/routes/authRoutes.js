import express from "express";
import { AuthService } from "../services/authService.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const result = await AuthService.login(correo, contraseña);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
