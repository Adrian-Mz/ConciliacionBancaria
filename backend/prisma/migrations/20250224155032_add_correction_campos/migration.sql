/*
  Warnings:

  - You are about to drop the column `credito` on the `LibroMayor` table. All the data in the column will be lost.
  - You are about to drop the column `debito` on the `LibroMayor` table. All the data in the column will be lost.
  - You are about to drop the column `fechaValor` on the `LibroMayor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LibroMayor" DROP COLUMN "credito",
DROP COLUMN "debito",
DROP COLUMN "fechaValor",
ADD COLUMN     "debe" DECIMAL(65,30) DEFAULT 0.00,
ADD COLUMN     "haber" DECIMAL(65,30) DEFAULT 0.00;
