/*
  Warnings:

  - You are about to drop the column `estadoManualId` on the `DetalleConciliacion` table. All the data in the column will be lost.
  - You are about to drop the `EstadoCuentaManual` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EstadoCuentaManualDetalle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DetalleConciliacion" DROP CONSTRAINT "DetalleConciliacion_estadoManualId_fkey";

-- DropForeignKey
ALTER TABLE "EstadoCuentaManual" DROP CONSTRAINT "EstadoCuentaManual_cuentaId_fkey";

-- DropForeignKey
ALTER TABLE "EstadoCuentaManual" DROP CONSTRAINT "EstadoCuentaManual_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "EstadoCuentaManualDetalle" DROP CONSTRAINT "EstadoCuentaManualDetalle_estadoCuentaManualId_fkey";

-- AlterTable
ALTER TABLE "CuentaBancaria" ADD COLUMN     "saldo" DECIMAL(65,30) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "DetalleConciliacion" DROP COLUMN "estadoManualId";

-- DropTable
DROP TABLE "EstadoCuentaManual";

-- DropTable
DROP TABLE "EstadoCuentaManualDetalle";

-- CreateTable
CREATE TABLE "MovimientosCuenta" (
    "id" SERIAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "fechaOperacion" TIMESTAMP(3) NOT NULL,
    "fechaValor" TIMESTAMP(3) NOT NULL,
    "concepto" TEXT NOT NULL,
    "importe" DECIMAL(65,30) NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientosCuenta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovimientosCuenta" ADD CONSTRAINT "MovimientosCuenta_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaBancaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
