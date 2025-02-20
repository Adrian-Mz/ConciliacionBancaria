import express from "express";
import { RolService } from "../services/rolService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await RolService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
