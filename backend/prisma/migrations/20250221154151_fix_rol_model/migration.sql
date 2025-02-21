/*
  Warnings:

  - You are about to drop the column `transaccionId` on the `DetalleConciliacion` table. All the data in the column will be lost.
  - You are about to drop the `TransaccionContable` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `estadoManualId` to the `DetalleConciliacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetalleConciliacion" DROP CONSTRAINT "DetalleConciliacion_transaccionId_fkey";

-- DropForeignKey
ALTER TABLE "TransaccionContable" DROP CONSTRAINT "TransaccionContable_cuentaId_fkey";

-- AlterTable
ALTER TABLE "DetalleConciliacion" DROP COLUMN "transaccionId",
ADD COLUMN     "estadoManualId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TransaccionContable";

-- CreateTable
CREATE TABLE "EstadoCuentaManual" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "referencia" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstadoCuentaManual_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EstadoCuentaManual" ADD CONSTRAINT "EstadoCuentaManual_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaBancaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstadoCuentaManual" ADD CONSTRAINT "EstadoCuentaManual_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleConciliacion" ADD CONSTRAINT "DetalleConciliacion_estadoManualId_fkey" FOREIGN KEY ("estadoManualId") REFERENCES "EstadoCuentaManual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
