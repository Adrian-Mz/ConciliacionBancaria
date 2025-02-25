/*
  Warnings:

  - Added the required column `cuentaId` to the `Conciliacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conciliacion" ADD COLUMN     "cuentaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Conciliacion" ADD CONSTRAINT "Conciliacion_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaBancaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
