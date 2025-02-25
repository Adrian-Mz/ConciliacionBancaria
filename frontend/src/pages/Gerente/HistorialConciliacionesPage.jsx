import { useEffect, useState } from "react";
import { conciliacionAPI } from "../../api/api.conciliaciones";

const HistorialConciliacionesPage = () => {
  const [conciliaciones, setConciliaciones] = useState([]);
  const [filtro, setFiltro] = useState("");

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

  const conciliacionesFiltradas = conciliaciones.filter(
    (c) =>
      c.cuenta.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      c.estado.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      c.observaciones?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Conciliaciones</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cuenta, estado u observación..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Cuenta</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {conciliacionesFiltradas.length > 0 ? (
              conciliacionesFiltradas.map((conciliacion) => (
                <tr key={conciliacion.id} className="border">
                  <td className="p-2 border">
                    {new Date(conciliacion.fecha).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{conciliacion.cuenta.nombre}</td>
                  <td
                    className={`p-2 border font-bold text-center ${
                      conciliacion.estado.nombre === "Pendiente"
                        ? "text-yellow-500"
                        : conciliacion.estado.nombre === "Conciliado"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {conciliacion.estado.nombre}
                  </td>
                  <td className="p-2 border">
                    {conciliacion.observaciones || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No hay conciliaciones disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialConciliacionesPage;
