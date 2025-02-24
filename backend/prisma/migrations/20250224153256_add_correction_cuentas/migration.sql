/*
  Warnings:

  - You are about to drop the column `saldo` on the `LibroMayor` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `MovimientoDetalle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LibroMayor" DROP COLUMN "saldo",
ADD COLUMN     "saldoAnterior" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "saldoFinal" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ALTER COLUMN "debito" SET DEFAULT 0.00,
ALTER COLUMN "credito" SET DEFAULT 0.00;

-- AlterTable
ALTER TABLE "MovimientoDetalle" DROP COLUMN "saldo",
ADD COLUMN     "saldoAnterior" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "saldoFinal" DECIMAL(65,30) NOT NULL DEFAULT 0.00;
