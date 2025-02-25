import express from "express";
import { ConciliacionService } from "../services/conciliacionService.js";
import prisma from "../data/prisma.js";

const router = express.Router();

// Obtener todas las conciliaciones
router.get("/", async (req, res) => {
  try {
    const conciliaciones = await ConciliacionService.getAllConciliaciones();
    res.json(conciliaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una conciliación por ID
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

// ✅ Obtener movimientos y libro mayor para conciliación
router.get("/preparar/:cuentaId/:fecha", async (req, res) => {
  try {
    const { cuentaId, fecha } = req.params;
    const detalles = await ConciliacionService.obtenerMovimientosParaConciliacion(Number(cuentaId), fecha);
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva conciliación (solo Contador)
router.post("/generar", async (req, res) => {
  try {
    const conciliacion = await ConciliacionService.generarConciliacion(req.body);
    res.json(conciliacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/cuenta/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conciliaciones = await ConciliacionService.getConciliacionByCuentaId(Number(id));

    if (!conciliaciones || conciliaciones.length === 0) {
      return res.status(404).json({ error: "No se encontraron conciliaciones para esta cuenta" });
    }

    res.json(conciliaciones);
  } catch (error) {
    console.error("Error al obtener conciliaciones por cuenta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


router.get("/movimientos/:cuentaId/:mes", async (req, res) => {
  try {
    const { cuentaId, mes } = req.params;

    if (!cuentaId || !mes) {
      return res.status(400).json({ error: "Cuenta y mes son requeridos." });
    }

    // Convertir el mes en formato de fecha
    const [year, month] = mes.split("-");
    const inicioMes = new Date(year, month - 1, 1);
    const finMes = new Date(year, month, 0, 23, 59, 59);

    console.log(`Buscando movimientos de cuenta ${cuentaId} entre ${inicioMes} y ${finMes}`);

    // 🔹 Obtener movimientos de la cuenta
    const movimientosBanco = await prisma.movimientosCuenta.findMany({
      where: {
        cuentaId: parseInt(cuentaId),
        createdAt: { gte: inicioMes, lte: finMes },
      },
      include: { detalles: true },
    });

    // 🔹 Obtener registros del libro mayor
    const librosMayor = await prisma.libroMayor.findMany({
      where: {
        cuentaId: parseInt(cuentaId),
        fechaOperacion: { gte: inicioMes, lte: finMes },
      },
    });

    console.log("Movimientos Banco:", movimientosBanco.length);
    console.log("Movimientos Libro Mayor:", librosMayor.length);

    // 🔹 Transformar los datos en un formato uniforme
    const movimientosFormato = movimientosBanco.flatMap((mov) =>
      mov.detalles.map((detalle) => ({
        fechaOperacion: detalle.fechaOperacion,
        descripcion: detalle.concepto,
        debe: detalle.importe >= 0 ? detalle.importe : 0,
        haber: detalle.importe < 0 ? Math.abs(detalle.importe) : 0,
        tipo: "Banco",
      }))
    );

    const librosFormato = librosMayor.map((libro) => ({
      fechaOperacion: libro.fechaOperacion,
      descripcion: libro.descripcion,
      debe: libro.debe || 0,
      haber: libro.haber || 0,
      tipo: "Libro Mayor",
    }));

    return res.json([...movimientosFormato, ...librosFormato]);
  } catch (error) {
    console.error("Error al obtener movimientos y libros mayor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
