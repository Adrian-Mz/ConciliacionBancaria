/*
  Warnings:

  - You are about to drop the column `descripcion` on the `EstadoCuentaManual` table. All the data in the column will be lost.
  - You are about to drop the column `referencia` on the `EstadoCuentaManual` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `EstadoCuentaManual` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `EstadoCuentaManual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EstadoCuentaManual" DROP COLUMN "descripcion",
DROP COLUMN "referencia",
DROP COLUMN "saldo",
DROP COLUMN "valor";

-- CreateTable
CREATE TABLE "EstadoCuentaManualDetalle" (
    "id" SERIAL NOT NULL,
    "estadoCuentaManualId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "referencia" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstadoCuentaManualDetalle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EstadoCuentaManualDetalle" ADD CONSTRAINT "EstadoCuentaManualDetalle_estadoCuentaManualId_fkey" FOREIGN KEY ("estadoCuentaManualId") REFERENCES "EstadoCuentaManual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
