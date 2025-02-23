-- AlterTable
ALTER TABLE "Conciliacion" ADD COLUMN     "auditorId" INTEGER,
ADD COLUMN     "directorId" INTEGER,
ADD COLUMN     "gerenteId" INTEGER,
ADD COLUMN     "observaciones" TEXT;

-- AddForeignKey
ALTER TABLE "Conciliacion" ADD CONSTRAINT "Conciliacion_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conciliacion" ADD CONSTRAINT "Conciliacion_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conciliacion" ADD CONSTRAINT "Conciliacion_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
