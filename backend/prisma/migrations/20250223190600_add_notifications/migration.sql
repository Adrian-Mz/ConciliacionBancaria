/*
  Warnings:

  - You are about to drop the column `gerenteId` on the `Conciliacion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conciliacion" DROP CONSTRAINT "Conciliacion_gerenteId_fkey";

-- AlterTable
ALTER TABLE "Conciliacion" DROP COLUMN "gerenteId";

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
