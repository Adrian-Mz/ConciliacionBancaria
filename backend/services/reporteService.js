import pdfkit from "pdfkit";
import fs from "fs";
import { ConciliacionData } from "../data/conciliacionData.js";

export const ReporteService = {
  async generarPDFConciliacion(conciliacionId) {
    const conciliacion = await ConciliacionData.getConciliacionById(conciliacionId);
    if (!conciliacion) throw new Error("Conciliación no encontrada");

    const doc = new pdfkit();
    const filename = `conciliacion_${conciliacionId}.pdf`;
    const stream = fs.createWriteStream(`./public/reports/${filename}`);

    doc.pipe(stream);
    doc.fontSize(18).text("Documento de Conciliación Bancaria", { align: "center" });
    doc.moveDown();
    
    doc.fontSize(12).text(`Fecha: ${conciliacion.fecha.toLocaleDateString()}`);
    doc.text(`Usuario: ${conciliacion.usuario.nombre}`);
    doc.text(`Estado: ${conciliacion.estado.nombre}`);
    doc.moveDown();

    doc.text("Detalles de Conciliación:", { underline: true });
    conciliacion.detallesConciliacion.forEach((detalle, index) => {
      doc.text(`${index + 1}. ${detalle.estadoManual.descripcion} - ${detalle.detalleReporte.descripcion}`);
    });

    doc.end();
    return { message: "Reporte generado", filename };
  }
};
