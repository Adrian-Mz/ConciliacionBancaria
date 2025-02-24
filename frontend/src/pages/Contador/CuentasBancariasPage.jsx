import { useEffect, useState } from "react";
import { cuentaBancariaAPI } from "../../api/api.cuentaBancaria";

const CuentasBancariasPage = () => {
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    cargarCuentas();
  }, []);

  const cargarCuentas = async () => {
    try {
      const data = await cuentaBancariaAPI.getAllCuentas();
      setCuentas(data);
    } catch (error) {
      console.error("Error al obtener cuentas bancarias:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cuentas Bancarias</h2>
      <ul className="bg-white rounded shadow p-4">
        {cuentas.map((cuenta) => (
          <li key={cuenta.id} className="border-b p-2">{cuenta.nombre} - {cuenta.banco} - {cuenta.saldo} - {cuenta.numero}</li>
        ))}
      </ul>
    </div>
  );
};

export default CuentasBancariasPage;
