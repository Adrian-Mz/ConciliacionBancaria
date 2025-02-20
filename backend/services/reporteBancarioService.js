import { ReporteBancarioData } from "../data/reporteBancarioData.js";

export const ReporteBancarioService = {
  async subirReporteBancario(data) {
    if (!data.usuarioId || !data.nombreArchivo) {
      throw new Error("Datos obligatorios faltantes");
    }
    return await ReporteBancarioData.createReporte(data);
  },

  async obtenerReportesBancarios() {
    return await ReporteBancarioData.getAllReportes();
  }
};
