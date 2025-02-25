import { useEffect, useState } from "react";
import { conciliacionAPI } from "../../api/api.conciliaciones";
import { cuentaBancariaAPI } from "../../api/api.cuentaBancaria";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const GenerarConciliacionPage = () => {
  const [cuentas, setCuentas] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [detallesConciliacion, setDetallesConciliacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState([]);
  const [estadoConciliacion, setEstadoConciliacion] = useState(null);

  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    cargarCuentas();
  }, []);

  const cargarCuentas = async () => {
    try {
      const data = await cuentaBancariaAPI.getAllCuentas();
      setCuentas(data);
    } catch (error) {
      console.error("❌ Error al obtener cuentas bancarias:", error);
    }
  };

  const handleSeleccionCuenta = async (cuentaId) => {
    setLoading(true);
    try {
      setCuentaSeleccionada(cuentaId);
      setEstadoConciliacion(null); // 🔹 Reiniciamos el estado de la conciliación
  
      console.log(`🔹 Buscando conciliación para cuenta: ${cuentaId} en mes: ${mesSeleccionado}`);
  
      // ✅ Verificar si ya existe una conciliación previa en el mes seleccionado
      const conciliacionesPrevias = await conciliacionAPI.getConciliacionByCuentaId(cuentaId);
      const conciliacionActual = conciliacionesPrevias.find((c) => c.fecha.startsWith(mesSeleccionado));
  
      if (conciliacionActual) {
        console.log("📌 Conciliación previa encontrada:", conciliacionActual);
        setEstadoConciliacion(conciliacionActual.estado.nombre);
      }
  
      // ✅ Obtener los movimientos para conciliación
      const conciliacion = await conciliacionAPI.getMovimientosParaConciliacion(cuentaId, mesSeleccionado);
      setDetallesConciliacion(conciliacion);
      setEditingData(conciliacion.map(detalle => ({ ...detalle })));
  
    } catch (error) {
      console.error("❌ Error al obtener datos para la conciliación:", error);
    }
    setLoading(false);
  };

  const handleEditarCampo = (index, campo, valor) => {
    const newData = [...editingData];
    newData[index][campo] = valor;
    setEditingData(newData);
  };

  const handleEnviarConciliacion = async () => {
    try {
        if (!cuentaSeleccionada) return;

        const usuario = JSON.parse(localStorage.getItem("user"));
        const fechaISO = new Date(`${mesSeleccionado}-01T00:00:00.000Z`).toISOString();

        // ✅ Transformar detalles asegurando que no haya valores null
        const detallesTransformados = editingData.map(detalle => ({
            fechaOperacion: detalle.fechaOperacion ? new Date(detalle.fechaOperacion).toISOString() : fechaISO,
            descripcion: detalle.descripcion || "Sin descripción",
            debe: detalle.debe ? parseFloat(detalle.debe) : 0, 
            haber: detalle.haber ? parseFloat(detalle.haber) : 0,
            estadoId: 1,
            movimientoCuentaId: detalle.movimientoCuentaId || null,
            libroMayorId: detalle.libroMayorId || null
        }));

        console.log("📌 Datos que se enviarán:", {
            usuarioId: usuario.id,
            cuentaId: Number(cuentaSeleccionada), 
            fecha: fechaISO,
            detalles: detallesTransformados
        });

        if (estadoConciliacion === "Rechazada") {
            console.log("🔄 Actualizando conciliación rechazada...");
            await conciliacionAPI.updateConciliacion({
                usuarioId: usuario.id,
                cuentaId: Number(cuentaSeleccionada), 
                fecha: fechaISO, 
                detalles: detallesTransformados,
            });
        } else {
            console.log("📌 Creando nueva conciliación...");
            await conciliacionAPI.createConciliacion({
                usuarioId: usuario.id,
                cuentaId: Number(cuentaSeleccionada), 
                fecha: fechaISO, 
                detalles: detallesTransformados,
            });
        }

        setModalOpen(false);
        toast.success("Conciliación enviada correctamente.");
        handleSeleccionCuenta(cuentaSeleccionada);

    } catch (error) {
        console.error("❌ Error al generar conciliación:", error);
        toast.error("No se pudo generar la conciliación.");
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generar Conciliación Bancaria</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <label className="block font-bold mb-2">Seleccionar Mes</label>
        <input
          type="month"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <label className="block font-bold mt-4 mb-2">Seleccionar Cuenta Bancaria</label>
        <select
          className="border p-2 rounded w-full"
          onChange={(e) => handleSeleccionCuenta(e.target.value)}
        >
          <option value="">Seleccione una cuenta</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.nombre} - {cuenta.numero}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center text-gray-500">⏳ Cargando detalles...</p>}

      {detallesConciliacion.length === 0 && !loading && (
        <p className="text-center text-gray-500">No hay datos disponibles para esta cuenta y mes.</p>
      )}

      {detallesConciliacion.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white p-4 rounded shadow mb-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold mb-3">📊 Detalles de la Conciliación</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Descripción</th>
                <th className="p-2 border">Debe</th>
                <th className="p-2 border">Haber</th>
                <th className="p-2 border">Origen</th>
              </tr>
            </thead>
            <tbody>
              {editingData.map((detalle, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{new Date(detalle.fechaOperacion).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    <input 
                      type="text"
                      value={detalle.descripcion}
                      onChange={(e) => handleEditarCampo(index, "descripcion", e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input 
                      type="number"
                      value={detalle.debe}
                      onChange={(e) => handleEditarCampo(index, "debe", e.target.value)}
                      className="border rounded p-1 w-full text-green-600"
                    />
                  </td>
                  <td className="p-2 border">
                    <input 
                      type="number"
                      value={detalle.haber}
                      onChange={(e) => handleEditarCampo(index, "haber", e.target.value)}
                      className="border rounded p-1 w-full text-red-600"
                    />
                  </td>
                  <td className="p-2 border text-center">{detalle.tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

        {estadoConciliacion && estadoConciliacion !== "Rechazada" ? (
          <p className="text-center text-yellow-500 font-bold">
            Ya existe una conciliación en estado <strong>&apos;{estadoConciliacion}&apos;</strong>. No se puede volver a enviar.
          </p>
        ) : (
          <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
            Enviar Conciliación
          </button>
        )}

      {modalOpen && (
        <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h3 className="text-lg font-bold mb-4">¿Estás seguro de enviar la conciliación?</h3>
              <div className="flex justify-center gap-4">
                <button onClick={handleEnviarConciliacion} className="bg-green-600 text-white px-4 py-2 rounded">
                  Enviar
                </button>
                <button onClick={() => setModalOpen(false)} className="bg-red-600 text-white px-4 py-2 rounded">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GenerarConciliacionPage;
