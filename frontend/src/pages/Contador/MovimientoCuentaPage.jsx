import { useEffect, useState } from "react";
import { movimientoCuentaAPI } from "../../api/api.movimientoCuenta";
import { cuentaBancariaAPI } from "../../api/api.cuentaBancaria";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const EstadosCuentaPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({ cuentaId: "", detalles: [] });
  const [detalles, setDetalles] = useState([{ fechaOperacion: "", fechaValor: "", concepto: "", importe: "", saldo: "" }]);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [detallesMovimiento, setDetallesMovimiento] = useState([]);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [movimientoAEliminar, setMovimientoAEliminar] = useState(null);



  useEffect(() => {
    cargarMovimientos();
    cargarCuentas();
  }, []);

  const cargarMovimientos = async () => {
    try {
      const data = await movimientoCuentaAPI.getAllMovimientos();
      setMovimientos(data);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
    }
  };

  const cargarCuentas = async () => {
    try {
      const data = await cuentaBancariaAPI.getAllCuentas();
      setCuentas(data);
    } catch (error) {
      console.error("Error al obtener cuentas bancarias:", error);
    }
  };

  const handleAddDetalle = () => {
    const saldoAnterior = detalles.length > 0 ? parseFloat(detalles[detalles.length - 1].saldo) || 0 : parseFloat(cuentaSeleccionada?.saldoBanco) || 0;

    const nuevoDetalle = {
        fechaOperacion: "",
        fechaValor: "",
        concepto: "",
        importe: 0,
        saldo: saldoAnterior // Inicia con el saldo previo en lugar de 0
    };

    setDetalles([...detalles, nuevoDetalle]);
  };



  const handleRemoveDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  const handleVerDetalles = (detalles) => {
    setDetallesMovimiento(detalles);
    setModalDetallesOpen(true);
  };
  

  const handleDetalleChange = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];

    if (campo === "importe") {
        // Convertir el importe a número asegurando que no sea NaN
        const importe = parseFloat(valor) || 0;
        nuevosDetalles[index][campo] = importe;

        // Calcular el saldo correctamente
        if (index === 0) {
            nuevosDetalles[index].saldo = (parseFloat(cuentaSeleccionada?.saldoBanco) || 0) + importe;
        } else {
            nuevosDetalles[index].saldo = nuevosDetalles[index - 1].saldo + importe;
        }
    } else {
        nuevosDetalles[index][campo] = valor;
    }

    setDetalles(nuevosDetalles);
  };


  const handleCuentaSeleccionada = (cuentaId) => {
    const cuenta = cuentas.find((c) => c.id === Number(cuentaId));
    if (!cuenta) return;

    setCuentaSeleccionada(cuenta);
    setNuevoMovimiento((prev) => ({
        ...prev,
        cuentaId,
    }));

    setDetalles([{ 
        fechaOperacion: "", 
        fechaValor: "", 
        concepto: "", 
        importe: 0, 
        saldo: parseFloat(cuenta.saldoBanco) || 0 
    }]);
  };


  const handleConfirmEliminar = (id) => {
    setMovimientoAEliminar(id);
    setModalConfirmOpen(true);
  };
  
  const handleEliminarMovimiento = async () => {
    if (!movimientoAEliminar) return;
    
    try {
      await movimientoCuentaAPI.deleteMovimiento(movimientoAEliminar);
      cargarMovimientos();
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
    } finally {
      setModalConfirmOpen(false);
      setMovimientoAEliminar(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuario = JSON.parse(localStorage.getItem("user"));
      if (!usuario || !usuario.id) {
        console.error("No se encontró usuario en localStorage");
        return;
      }
  
      if (!nuevoMovimiento.cuentaId) {
        console.error("Cuenta ID es requerida");
        return;
      }
  
      if (!Array.isArray(detalles) || detalles.length === 0) {
        console.error("Debe haber al menos un detalle de movimiento");
        return;
      }
  
      const movimientoData = {
        ...nuevoMovimiento,
        cuentaId: Number(nuevoMovimiento.cuentaId),
        usuarioId: usuario.id,
        detalles: detalles.map(detalle => ({
          fechaOperacion: detalle.fechaOperacion ? detalle.fechaOperacion : new Date().toISOString().split('T')[0],
          fechaValor: detalle.fechaValor ? detalle.fechaValor : new Date().toISOString().split('T')[0],
          concepto: detalle.concepto || "Sin concepto",
          importe: Number(detalle.importe) || 0
        }))
      };
  
      console.log("📌 Enviando datos:", JSON.stringify(movimientoData, null, 2));
      await movimientoCuentaAPI.createMovimiento(movimientoData);
      setModalOpen(false);
      cargarMovimientos();
    } catch (error) {
      console.error("Error al agregar movimiento:", error);
    }
  };
  
  
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Movimientos de Cuentas</h2>
      <button
        onClick={() => {
          setNuevoMovimiento({ cuentaId: "", detalles: [] });
          setDetalles([{ fechaOperacion: "", fechaValor: "", concepto: "", importe: "", saldo: "" }]);
          setModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center mb-4"
      >
        Agregar Movimiento <FaPlus className="ml-2" />
      </button>

      <table className="w-full bg-white rounded shadow-md table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Fecha Movimiento</th>
            <th className="p-3">Cuenta</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((mov) => (
            <tr key={mov.id} className="border-t">
              <td className="p-3 text-center">
                {mov.detalles.length > 0
                  ? new Date(mov.detalles[0].fechaOperacion).toLocaleDateString("es-ES", { month: "long", year: "numeric" })
                  : "Sin fecha"}
              </td>
              <td className="p-3">{mov.cuenta?.nombre || "Cuenta no encontrada"}</td>
              <td className="p-3 flex justify-center">
                <button
                  className="text-yellow-600"
                  onClick={() => {
                    setCuentaSeleccionada(mov.cuenta);
                    setDetalles(mov.detalles || []);
                    setModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-green-600"
                  onClick={() => handleVerDetalles(mov.detalles)}
                >
                  <FaPlus /> {/* Ver Detalles */}
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleConfirmEliminar(mov.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50" onClick={() => setModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl border border-gray-300 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Agregar Movimiento</h2>
            <form onSubmit={handleSubmit}>
              <label className="block">Cuenta:</label>
              <select
                className="border p-2 rounded w-full mb-4"
                value={nuevoMovimiento.cuentaId}
                onChange={(e) => handleCuentaSeleccionada(e.target.value)}
                required
              >
                <option value="">Selecciona una cuenta</option>
                {cuentas.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.nombre} - {cuenta.numero}
                  </option>
                ))}
              </select>

              <hr className="my-4" />
              {cuentaSeleccionada && (
                <div className="bg-gray-100 p-3 rounded mb-4">
                  <h3 className="text-lg font-semibold">Detalles de la Cuenta Seleccionada</h3>
                  <p><strong>Nombre:</strong> {cuentaSeleccionada.nombre}</p>
                  <p><strong>Número:</strong> {cuentaSeleccionada.numero}</p>
                  <p><strong>Banco:</strong> {cuentaSeleccionada.banco}</p>
                  <p><strong>Saldo Actual:</strong> ${cuentaSeleccionada.saldo}</p>
                </div>
              )}

              <h3 className="font-semibold mb-2">Detalles de Transacciones</h3>
              <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
                <thead>
                  <tr className="border-b border-gray-200 hover:bg-gray-100 transition">
                    <th>Fecha Operación</th>
                    <th>Fecha Valor</th>
                    <th>Concepto</th>
                    <th>Importe</th>
                    <th>Saldo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td><input type="date" value={detalle.fechaOperacion} onChange={(e) => handleDetalleChange(index, "fechaOperacion", e.target.value)} required /></td>
                      <td><input type="date" value={detalle.fechaValor} onChange={(e) => handleDetalleChange(index, "fechaValor", e.target.value)} required /></td>
                      <td><input type="text" value={detalle.concepto} onChange={(e) => handleDetalleChange(index, "concepto", e.target.value)} required /></td>
                      <td><input type="number" value={detalle.importe} onChange={(e) => handleDetalleChange(index, "importe", e.target.value)} required /></td>
                      <td>{detalle.saldo}</td>
                      <td>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveDetalle(index)} 
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-lg transition flex items-center justify-center"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button 
                type="button" 
                onClick={handleAddDetalle} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition flex items-center justify-center mt-4"
              >
                <FaPlus className="mr-2" /> Añadir Movimiento
              </button>
              <button
               type="submit"
               className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition flex items-center justify-center mt-4"
              >
                Guardar
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {modalDetallesOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detalles del Movimiento</h2>
              <button onClick={() => setModalDetallesOpen(false)} className="text-gray-500 hover:text-gray-800">
                ✖️
              </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm tracking-wider">
                  <th className="p-2">Fecha Operación</th>
                  <th className="p-2">Fecha Valor</th>
                  <th className="p-2">Concepto</th>
                  <th className="p-2">Importe</th>
                </tr>
              </thead>
              <tbody>
                {detallesMovimiento.map((detalle, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition">
                    <td className="p-2">{new Date(detalle.fechaOperacion).toLocaleDateString("es-ES")}</td>
                    <td className="p-2">{new Date(detalle.fechaValor).toLocaleDateString("es-ES")}</td>
                    <td className="p-2">{detalle.concepto}</td>
                    <td className="p-2">{detalle.importe}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right">
              <button
                onClick={() => setModalDetallesOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {modalConfirmOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-300"
        >
          <h2 className="text-lg font-bold mb-4">¿Confirmar Eliminación?</h2>
          <p className="text-gray-600">¿Estás seguro de que deseas eliminar este movimiento?</p>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setModalConfirmOpen(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={handleEliminarMovimiento}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
          </div>
        </motion.div>
      </div>
    )}

    </div>
  );
};

export default EstadosCuentaPage;
