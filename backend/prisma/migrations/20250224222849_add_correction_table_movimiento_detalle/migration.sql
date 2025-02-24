-- DropForeignKey
ALTER TABLE "MovimientoDetalle" DROP CONSTRAINT "MovimientoDetalle_movimientoId_fkey";

-- AddForeignKey
ALTER TABLE "MovimientoDetalle" ADD CONSTRAINT "MovimientoDetalle_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "MovimientosCuenta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
