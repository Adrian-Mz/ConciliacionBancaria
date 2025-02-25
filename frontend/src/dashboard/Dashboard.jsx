import { useEffect, useState } from "react";
import { conciliacionAPI } from "../api/api.conciliaciones";
import { usuarioAPI } from "../api/api.usuarios";
import { cuentaBancariaAPI } from "../api/api.cuentaBancaria";

const Dashboard = () => {
  const [conciliacionesPendientes, setConciliacionesPendientes] = useState(0);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState(0);
  const [cuentasBancarias, setCuentasBancarias] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar conciliaciones pendientes
      const conciliaciones = await conciliacionAPI.getAllConciliaciones();
      console.log("📌 Conciliaciones:", conciliaciones);
      const pendientes = conciliaciones?.filter(c => c.estado === "Pendiente").length || 0;
      setConciliacionesPendientes(pendientes);

      // Cargar usuarios registrados
      const usuarios = await usuarioAPI.getAllUsuarios();
      console.log("📌 Usuarios obtenidos:", usuarios);
      if (Array.isArray(usuarios)) {
        setUsuariosRegistrados(usuarios.length);
      } else {
        console.error("⚠️ Error: La API de usuarios no devolvió un array.");
      }

      // Cargar cuentas bancarias registradas
      const cuentas = await cuentaBancariaAPI.getAllCuentas();
      console.log("📌 Cuentas Bancarias:", cuentas);
      setCuentasBancarias(cuentas?.length || 0);

    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Dashboard General</h2>

      {/* Información sobre conciliación bancaria */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-bold">¿Qué es la Conciliación Bancaria?</h3>
        <p className="text-gray-700 mt-2">
          La conciliación bancaria es un proceso contable que compara los registros internos de una empresa 
          con los extractos del banco para asegurarse de que coincidan. Esto ayuda a identificar errores, 
          fraudes o transacciones pendientes.
        </p>
      </div>

      {/* Tarjetas con métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md border-l-8 border-blue-500">
          <h3 className="font-bold text-lg text-blue-700">Conciliaciones Pendientes</h3>
          <p className="text-3xl font-bold text-blue-900">{conciliacionesPendientes}</p>
          <p className="text-gray-600">A la espera de revisión.</p>
        </div>

        <div className="bg-green-100 p-6 rounded-lg shadow-md border-l-8 border-green-500">
          <h3 className="font-bold text-lg text-green-700">Usuarios Registrados</h3>
          <p className="text-3xl font-bold text-green-900">{usuariosRegistrados}</p>
          <p className="text-gray-600">Usuarios activos en el sistema.</p>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow-md border-l-8 border-purple-500">
          <h3 className="font-bold text-lg text-purple-700">Cuentas Bancarias</h3>
          <p className="text-3xl font-bold text-purple-900">{cuentasBancarias}</p>
          <p className="text-gray-600">Total de cuentas registradas.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
