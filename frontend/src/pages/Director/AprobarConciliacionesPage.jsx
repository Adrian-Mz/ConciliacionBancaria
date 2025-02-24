import { useEffect, useState } from "react";
import { conciliacionAPI } from "../../api/api.conciliaciones";

const AprobarConciliacionesPage = () => {
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

  const aprobarConciliacion = async (id) => {
    try {
      await conciliacionAPI.updateConciliacion(id, { estadoId: 3 }); // Estado "Conciliado"
      cargarConciliaciones();
    } catch (error) {
      console.error("Error al aprobar conciliación:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Aprobar Conciliaciones</h2>
      <ul className="bg-white rounded shadow p-4">
        {conciliaciones.map((conciliacion) => (
          <li key={conciliacion.id} className="border-b p-2 flex justify-between">
            {conciliacion.fecha} - Estado: {conciliacion.estado.nombre}
            <button onClick={() => aprobarConciliacion(conciliacion.id)} className="bg-green-500 text-white p-2 rounded">
              Aprobar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AprobarConciliacionesPage;
