/*
  Warnings:

  - You are about to drop the column `detalleReporteId` on the `DetalleConciliacion` table. All the data in the column will be lost.
  - You are about to drop the `DetalleReporte` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReporteBancario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DetalleConciliacion" DROP CONSTRAINT "DetalleConciliacion_detalleReporteId_fkey";

-- DropForeignKey
ALTER TABLE "DetalleReporte" DROP CONSTRAINT "DetalleReporte_cuentaId_fkey";

-- DropForeignKey
ALTER TABLE "DetalleReporte" DROP CONSTRAINT "DetalleReporte_reporteId_fkey";

-- DropForeignKey
ALTER TABLE "ReporteBancario" DROP CONSTRAINT "ReporteBancario_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "ReporteBancario" DROP CONSTRAINT "ReporteBancario_usuarioId_fkey";

-- AlterTable
ALTER TABLE "DetalleConciliacion" DROP COLUMN "detalleReporteId",
ADD COLUMN     "libroMayorId" INTEGER,
ADD COLUMN     "movimientoCuentaId" INTEGER;

-- DropTable
DROP TABLE "DetalleReporte";

-- DropTable
DROP TABLE "ReporteBancario";

-- CreateTable
CREATE TABLE "LibroMayor" (
    "id" SERIAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fechaOperacion" TIMESTAMP(3) NOT NULL,
    "fechaValor" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "debito" DECIMAL(65,30),
    "credito" DECIMAL(65,30),
    "saldo" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibroMayor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LibroMayor" ADD CONSTRAINT "LibroMayor_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaBancaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibroMayor" ADD CONSTRAINT "LibroMayor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleConciliacion" ADD CONSTRAINT "DetalleConciliacion_libroMayorId_fkey" FOREIGN KEY ("libroMayorId") REFERENCES "LibroMayor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleConciliacion" ADD CONSTRAINT "DetalleConciliacion_movimientoCuentaId_fkey" FOREIGN KEY ("movimientoCuentaId") REFERENCES "MovimientosCuenta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
