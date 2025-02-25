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
    console.error("❌ Error al obtener todas las conciliaciones:", error);
    res.status(500).json({ error: error.message });
  }
});
 
// Obtener una conciliación por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
 
    const conciliacion = await ConciliacionService.getConciliacionById(id);
    if (!conciliacion) {
      return res.status(404).json({ error: "Conciliación no encontrada" });
    }
 
    console.log("✅ Conciliación obtenida:", conciliacion);
    res.json(conciliacion);
  } catch (error) {
    console.error("❌ Error al obtener conciliación:", error);
    res.status(400).json({ error: error.message });
  }
});
 
// Obtener movimientos y libro mayor para conciliación
router.get("/preparar/:cuentaId/:fecha", async (req, res) => {
  try {
    const { cuentaId, fecha } = req.params;
    if (!cuentaId || !fecha) {
      return res.status(400).json({ error: "Cuenta y fecha son requeridos." });
    }
 
    const detalles = await ConciliacionService.obtenerMovimientosParaConciliacion(Number(cuentaId), fecha);
    res.json(detalles);
  } catch (error) {
    console.error("❌ Error al preparar conciliación:", error);
    res.status(500).json({ error: error.message });
  }
});
 
// Crear una nueva conciliación (solo Contador)
router.post("/generar", async (req, res) => {
  try {
    console.log("📌 Datos recibidos en POST /generar:", req.body);
    const conciliacion = await ConciliacionService.generarConciliacion(req.body);
 
    if (!conciliacion) {
      return res.status(400).json({ error: "No se pudo generar la conciliación." });
    }
 
    console.log("✅ Conciliación generada:", conciliacion);
    res.json(conciliacion);
  } catch (error) {
    console.error("❌ Error al generar conciliación:", error);
    res.status(400).json({ error: error.message });
  }
});
 
// Obtener conciliaciones por cuentaId
router.get("/cuenta/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conciliaciones = await ConciliacionService.getConciliacionByCuentaId(Number(id));
 
    if (!conciliaciones || conciliaciones.length === 0) {
      return res.status(404).json({ error: "No se encontraron conciliaciones para esta cuenta" });
    }
 
    res.json(conciliaciones);
  } catch (error) {
    console.error("❌ Error al obtener conciliaciones por cuenta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
 
// Obtener movimientos y libro mayor de una cuenta en un mes específico
router.get("/movimientos/:cuentaId/:mes", async (req, res) => {
  try {
    const { cuentaId, mes } = req.params;
 
    if (!cuentaId || !mes) {
      return res.status(400).json({ error: "Cuenta y mes son requeridos." });
    }
 
    // 🔹 Convertir el mes en formato de fecha correctamente
    const [year, month] = mes.split("-");
    if (!year || !month) {
      return res.status(400).json({ error: "Formato de mes inválido. Use 'YYYY-MM'." });
    }
 
    const inicioMes = new Date(year, month - 1, 1);
    const finMes = new Date(year, month, 0, 23, 59, 59);
 
    console.log(`📌 Buscando movimientos de cuenta ${cuentaId} entre ${inicioMes} y ${finMes}`);
 
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
 
    console.log("📌 Movimientos Banco:", movimientosBanco.length);
    console.log("📌 Movimientos Libro Mayor:", librosMayor.length);
 
    if (movimientosBanco.length === 0 && librosMayor.length === 0) {
      return res.status(404).json({ error: "No hay movimientos ni registros en el libro mayor para este mes." });
    }
 
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
 
    res.json([...movimientosFormato, ...librosFormato]);
  } catch (error) {
    console.error("❌ Error al obtener movimientos y libros mayor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar el estado de una conciliación (Aprobación/Rechazo)
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { estadoId, auditorId, observaciones } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar la conciliación
    const conciliacionExistente = await prisma.conciliacion.findUnique({ where: { id } });
    if (!conciliacionExistente) {
      return res.status(404).json({ error: "Conciliación no encontrada" });
    }

    // Actualizar la conciliación
    const conciliacionActualizada = await prisma.conciliacion.update({
      where: { id },
      data: {
        estadoId,
        auditorId: auditorId || conciliacionExistente.auditorId, // Registrar el auditor si es necesario
        observaciones: observaciones || null,
      },
    });

    console.log("✅ Conciliación actualizada:", conciliacionActualizada);
    res.json(conciliacionActualizada);
  } catch (error) {
    console.error("❌ Error al actualizar conciliación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
 
export default router;