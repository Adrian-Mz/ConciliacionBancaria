/*
  Warnings:

  - You are about to drop the column `concepto` on the `MovimientosCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `fechaOperacion` on the `MovimientosCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `fechaValor` on the `MovimientosCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `importe` on the `MovimientosCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `MovimientosCuenta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MovimientosCuenta" DROP COLUMN "concepto",
DROP COLUMN "fechaOperacion",
DROP COLUMN "fechaValor",
DROP COLUMN "importe",
DROP COLUMN "saldo";
