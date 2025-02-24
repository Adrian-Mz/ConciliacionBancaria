/*
  Warnings:

  - Added the required column `usuarioId` to the `MovimientosCuenta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovimientosCuenta" ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MovimientosCuenta" ADD CONSTRAINT "MovimientosCuenta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
