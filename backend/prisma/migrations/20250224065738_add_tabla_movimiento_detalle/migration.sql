-- CreateTable
CREATE TABLE "MovimientoDetalle" (
    "id" SERIAL NOT NULL,
    "movimientoId" INTEGER NOT NULL,
    "fechaOperacion" TIMESTAMP(3) NOT NULL,
    "fechaValor" TIMESTAMP(3) NOT NULL,
    "concepto" TEXT NOT NULL,
    "importe" DECIMAL(65,30) NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoDetalle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovimientoDetalle" ADD CONSTRAINT "MovimientoDetalle_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "MovimientosCuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
