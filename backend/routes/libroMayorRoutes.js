import express from "express";
import { LibroMayorService } from "../services/libroMayorService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const libros = await LibroMayorService.getAllLibros();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const libro = await LibroMayorService.getLibroById(parseInt(req.params.id));
    res.json(libro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const libro = await LibroMayorService.createLibro(req.body);
    res.json(libro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const libro = await LibroMayorService.updateLibro(parseInt(req.params.id), req.body);
    res.json(libro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const libro = await LibroMayorService.deleteLibro(parseInt(req.params.id));
    res.json(libro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
