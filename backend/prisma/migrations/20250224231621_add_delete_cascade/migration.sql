-- DropForeignKey
ALTER TABLE "LibroMayor" DROP CONSTRAINT "LibroMayor_cuentaId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientosCuenta" DROP CONSTRAINT "MovimientosCuenta_cuentaId_fkey";

-- AddForeignKey
ALTER TABLE "MovimientosCuenta" ADD CONSTRAINT "MovimientosCuenta_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaBancaria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibroMayor" ADD CONSTRAINT "LibroMayor_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaBancaria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
