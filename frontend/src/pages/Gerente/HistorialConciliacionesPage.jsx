import { useEffect, useState } from "react";
import { conciliacionAPI } from "../../api/api.conciliaciones";

const HistorialConciliacionesPage = () => {
  const [conciliaciones, setConciliaciones] = useState([]);

  useEffect(() => {
    cargarConciliaciones();
  }, []);

  const cargarConciliaciones = async () => {
    try {
      const data = await conciliacionAPI.getAllConciliaciones();
      setConciliaciones(data);
    } catch (error) {
      console.error("Error al obtener conciliaciones:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Conciliaciones</h2>
      <ul className="bg-white rounded shadow p-4">
        {conciliaciones.map((conciliacion) => (
          <li key={conciliacion.id} className="border-b p-2">
            {conciliacion.fecha} - Estado: {conciliacion.estado.nombre} - Observaciones: {conciliacion.observaciones || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialConciliacionesPage;
