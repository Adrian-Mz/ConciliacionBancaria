import { useEffect, useState } from "react";
import { conciliacionAPI } from "../../api/api.conciliaciones";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
 
const RevisarConciliacionesPage = () => {
  const [conciliaciones, setConciliaciones] = useState([]);
  const [selectedConciliacion, setSelectedConciliacion] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [observaciones, setObservaciones] = useState("");
 
  useEffect(() => {
    cargarConciliaciones();
  }, []);
 
  const cargarConciliaciones = async () => {
    try {
      const data = await conciliacionAPI.getAllConciliaciones();
      setConciliaciones(data);
    } catch (error) {
      console.error("Error al obtener conciliaciones:", error);
      toast.error("No se pudieron cargar las conciliaciones.");
    }
  };
 
  const aprobarConciliacion = async (conciliacionId) => {
    try {
        await conciliacionAPI.updateConciliacionEstado(conciliacionId, {
            estadoId: 2, // Estado "Conciliado"
            auditorId: JSON.parse(localStorage.getItem("user")).id
        });
 
        toast.success("Conciliación aprobada correctamente.");
 
        // Recargar lista de conciliaciones
        cargarConciliaciones();
        setModalOpen(false);
    } catch (error) {
        console.error("Error al aprobar la conciliación:", error);
        toast.error("No se pudo aprobar la conciliación.");
    }
  };
 
  const rechazarConciliacion = async (conciliacionId) => {
    if (!observaciones.trim()) {
        toast.warning("Debes agregar una observación para rechazar la conciliación.");
        return;
    }
 
    try {
        await conciliacionAPI.updateConciliacionEstado(conciliacionId, {
            estadoId: 4, // Estado "Rechazado"
            auditorId: JSON.parse(localStorage.getItem("user")).id,
            observaciones
        });
 
        toast.success("Conciliación rechazada correctamente.");
 
        // Recargar lista de conciliaciones
        cargarConciliaciones();
        setModalOpen(false);
    } catch (error) {
        console.error("Error al rechazar la conciliación:", error);
        toast.error("No se pudo rechazar la conciliación.");
    }
  };
 
 
 
  const abrirModal = async (conciliacion) => {
    setSelectedConciliacion(conciliacion);
    setModalOpen(true);
    setObservaciones("");
 
    try {
        const data = await conciliacionAPI.getConciliacionById(conciliacion.id);
 
        // ✅ Verificación de datos antes de asignarlos a la tabla
        const detallesProcesados = data.conciliacionesDetalles.map((detalle) => {
            const movimiento = detalle.movimientoCuenta;
            const libro = detalle.libroMayor;
 
            return {
                fecha: movimiento?.fechaOperacion
                    ? new Date(movimiento.fechaOperacion).toLocaleDateString()
                    : libro?.fechaOperacion
                    ? new Date(libro.fechaOperacion).toLocaleDateString()
                    : "Sin Fecha",
                descripcion: movimiento?.descripcion || libro?.descripcion || "No disponible",
                debe: movimiento?.debe !== undefined ? parseFloat(movimiento.debe).toFixed(2) :
                      libro?.debe !== undefined ? parseFloat(libro.debe).toFixed(2) : "0.00",
                haber: movimiento?.haber !== undefined ? parseFloat(movimiento.haber).toFixed(2) :
                       libro?.haber !== undefined ? parseFloat(libro.haber).toFixed(2) : "0.00"
            };
        });
 
        setDetalles(detallesProcesados);
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        toast.error("No se pudieron cargar los detalles de la conciliación.");
    }
  };
 
  const cerrarModal = () => {
    setModalOpen(false);
    setSelectedConciliacion(null);
    setDetalles([]);
  };
 
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Revisión de Conciliaciones</h2>
      <ul className="bg-white rounded shadow p-4">
        {conciliaciones.map((conciliacion) => (
          <li key={conciliacion.id} className="border-b p-2 flex justify-between items-center">
            <span>
              {new Date(conciliacion.fecha).toLocaleDateString()} - {conciliacion.cuenta.nombre} -
              <span className={`ml-2 font-bold ${conciliacion.estado.nombre === "Pendiente" ? "text-yellow-500" : conciliacion.estado.nombre === "Conciliado" ? "text-green-500" : "text-red-500"}`}>
                {conciliacion.estado.nombre}
              </span>
            </span>
            <button
              onClick={() => abrirModal(conciliacion)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Revisar
            </button>
          </li>
        ))}
      </ul>
 
      {modalOpen && selectedConciliacion && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Revisar Conciliación</h3>
            <p><strong>Cuenta:</strong> {selectedConciliacion.cuenta.nombre}</p>
            <p><strong>Fecha:</strong> {new Date(selectedConciliacion.fecha).toLocaleDateString()}</p>
 
            <h4 className="font-bold mt-4">Detalles:</h4>
            <div className="max-h-64 overflow-y-auto border rounded">
              <table className="w-full border-collapse border mt-2 text-sm">
                <tbody>
                {detalles.length > 0 ? (
                  <table className="w-full border-collapse border">
                      <thead>
                          <tr className="bg-gray-200">
                              <th className="p-2 border">Fecha</th>
                              <th className="p-2 border">Descripción</th>
                              <th className="p-2 border">Debe</th>
                              <th className="p-2 border">Haber</th>
                          </tr>
                      </thead>
                      <div className="max-h-64 overflow-y-auto border rounded">
                      {detalles.length > 0 ? (
                        <table className="w-full border-collapse border">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="p-2 border">Fecha</th>
                              <th className="p-2 border">Descripción</th>
                              <th className="p-2 border">Debe</th>
                              <th className="p-2 border">Haber</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detalles.map((detalle, index) => (
                              <tr key={index} className="border">
                                <td className="p-2 border">{detalle.fecha}</td>
                                <td className="p-2 border">{detalle.descripcion}</td>
                                <td className="p-2 border text-green-600">${detalle.debe}</td>
                                <td className="p-2 border text-red-600">${detalle.haber}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center p-4 text-gray-500">No hay detalles disponibles para esta conciliación.</div>
                      )}
                    </div>

                  </table>
                ) : (
                    <p className="text-center text-gray-500">No hay detalles disponibles para esta conciliación.</p>
                )}
                </tbody>
              </table>
            </div>
 
            <label className="block font-bold mt-4">Observaciones</label>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Opcional, solo si se rechaza"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            ></textarea>
            <div className="flex justify-between mt-4">
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => aprobarConciliacion(selectedConciliacion.id)}
              >
                Aprobar
              </button>
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => rechazarConciliacion(selectedConciliacion.id)}
              >
                Rechazar
              </button>
              <button 
                onClick={cerrarModal} 
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
 
export default RevisarConciliacionesPage;