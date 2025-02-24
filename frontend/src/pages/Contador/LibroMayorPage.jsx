import { useEffect, useState } from "react";
import { libroMayorAPI } from "../../api/api.libroMayor";
import { cuentaBancariaAPI } from "../../api/api.cuentaBancaria";
import { FaPlus, FaTrash, FaInfoCircle, FaEdit } from "react-icons/fa"; // 🔹 Eliminado FaEdit
import { motion } from "framer-motion";

const LibroMayorPage = () => {
  const [librosMayores, setLibrosMayores] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [detallesOpen, setDetallesOpen] = useState(false);
  const [detallesLibro, setDetallesLibro] = useState([]);
  
  const [nuevoRegistro, setNuevoRegistro] = useState({
    cuentaId: "",
    fechaOperacion: "",
    descripcion: "",
    debe: 0,
    haber: 0,
    saldoAnterior: 0,
    saldoFinal: 0,
  });

  useEffect(() => {
    cargarLibrosMayores();
    cargarCuentas();
  }, []);


  const cargarLibrosMayores = async () => {
    try {
      const data = await libroMayorAPI.getAll();
      setLibrosMayores(data);
    } catch (error) {
      console.error("Error al obtener libros mayores:", error);
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

  const handleEdit = (libro) => {
    setCuentaSeleccionada(libro.cuenta);
    setNuevoRegistro({
      id: libro.id,
      cuentaId: libro.cuentaId,
      fechaOperacion: libro.fechaOperacion,
      descripcion: libro.descripcion,
      debe: libro.debe,
      haber: libro.haber,
      saldoAnterior: libro.saldoAnterior,
      saldoFinal: libro.saldoFinal,
    });
    setModalOpen(true);
  };
  
  
  // Manejar la selección de cuenta y establecer el saldo anterior automáticamente
  const handleCuentaSeleccionada = (cuentaId) => {
    const cuenta = cuentas.find((c) => c.id === Number(cuentaId));
  
    if (!cuenta) return;
  
    setCuentaSeleccionada(cuenta);
  
    setNuevoRegistro((prev) => ({
      ...prev,
      cuentaId,
      saldoAnterior: cuenta.saldo, 
      saldoFinal: cuenta.saldo, 
      detalles: prev.detalles || [], // 🔹 Asegurando que detalles sea siempre un array
    }));
  };
  
  // Manejar la adición de una nueva fila en la tabla de transacciones
  const handleAddDetalle = () => {
    setNuevoRegistro((prev) => ({
      ...prev,
      detalles: [
        ...(Array.isArray(prev.detalles) ? prev.detalles : []), // 🔹 Asegurar que prev.detalles sea un array
        { fecha: "", descripcion: "", debe: 0, haber: 0, saldo: prev.saldoFinal }, 
      ],
    }));
  };
  
  
  // Manejar la eliminación de una fila de la tabla de transacciones
  const handleRemoveDetalle = (index) => {
    setNuevoRegistro((prev) => {
      const nuevosDetalles = Array.isArray(prev.detalles) ? prev.detalles.filter((_, i) => i !== index) : []; // 🔹 Verificar si prev.detalles es un array
      return {
        ...prev,
        detalles: nuevosDetalles,
        saldoFinal: calcularSaldoFinal(nuevosDetalles, prev.saldoAnterior),
      };
    });
  };

  // Manejar cambios en los detalles de la tabla (Fecha, Descripción, Debe, Haber)
  const handleDetalleChange = (index, campo, valor) => {
    setNuevoRegistro((prev) => {
      const nuevosDetalles = [...prev.detalles];
  
      if (campo === "debe") {
        nuevosDetalles[index]["debe"] = parseFloat(valor) || 0;
        nuevosDetalles[index]["haber"] = 0; // Bloquear haber si debe tiene valor
      } else if (campo === "haber") {
        nuevosDetalles[index]["haber"] = parseFloat(valor) || 0;
        nuevosDetalles[index]["debe"] = 0; // Bloquear debe si haber tiene valor
      } else {
        nuevosDetalles[index][campo] = valor;
      }
  
      let saldoAnterior = cuentaSeleccionada ? parseFloat(cuentaSeleccionada.saldo) : 0;
  
      for (let i = 0; i < nuevosDetalles.length; i++) {
        const debe = parseFloat(nuevosDetalles[i].debe) || 0;
        const haber = parseFloat(nuevosDetalles[i].haber) || 0;
  
        nuevosDetalles[i].saldo =
          i === 0
            ? saldoAnterior + debe - haber
            : nuevosDetalles[i - 1].saldo + debe - haber;
      }
  
      const saldoFinal = nuevosDetalles.length > 0 ? nuevosDetalles[nuevosDetalles.length - 1].saldo : saldoAnterior;
  
      return {
        ...prev,
        detalles: nuevosDetalles,
        saldoFinal,
      };
    });
  };
  

  
  
  // Función para calcular el saldo final con base en los detalles de la tabla
  const calcularSaldoFinal = (detalles, saldoAnterior) => {
    return detalles.reduce((saldo, detalle) => saldo + detalle.debe - detalle.haber, saldoAnterior);
  };
  
  // Manejar el envío del formulario para registrar la información
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuario = JSON.parse(localStorage.getItem("user"));
      if (!usuario || !usuario.id) {
        console.error("No se encontró usuario en localStorage");
        return;
      }
  
      if (!nuevoRegistro.cuentaId) {
        console.error("Cuenta ID es requerida");
        return;
      }
  
      // Validar que al menos un detalle esté presente
      if (!Array.isArray(nuevoRegistro.detalles) || nuevoRegistro.detalles.length === 0) {
        console.error("Debe haber al menos un detalle de movimiento");
        return;
      }
  
      // Extraer el primer detalle para construir la estructura de la API
      const detalle = nuevoRegistro.detalles[0]; // Solo un detalle por petición
  
      const libroMayorData = {
        cuentaId: Number(nuevoRegistro.cuentaId),
        usuarioId: usuario.id,
        fechaOperacion: detalle.fecha || new Date().toISOString().split("T")[0], // Fecha de operación
        descripcion: detalle.descripcion || "Sin descripción",
        debe: Number(detalle.debe) || 0,
        haber: Number(detalle.haber) || 0,
      };
  
      console.log("📌 Enviando datos:", JSON.stringify(libroMayorData, null, 2));
  
      // Si hay un ID, significa que se está editando un registro
      if (nuevoRegistro.id) {
        await libroMayorAPI.update(nuevoRegistro.id, libroMayorData);
      } else {
        await libroMayorAPI.create(libroMayorData);
      }
  
      setModalOpen(false);
      cargarLibrosMayores();
    } catch (error) {
      console.error("Error al guardar registro:", error);
    }
  };
  

  const handleViewDetails = (libro) => {
    setDetallesLibro(Array.isArray(libro) ? libro : [libro]); // 🔹 Asegurar que siempre sea un array
    setDetallesOpen(true);
  };

  
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      try {
        await libroMayorAPI.delete(id);
        cargarLibrosMayores();
      } catch (error) {
        console.error("Error al eliminar registro:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Libro Mayor</h2>
      <button
        onClick={() => {
          setNuevoRegistro({
            cuentaId: "",
            fechaOperacion: "",
            descripcion: "",
            debe: 0,
            haber: 0,
            saldoAnterior: 0,
            saldoFinal: 0,
          });
          setModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center mb-4"
      >
        Agregar Registro <FaPlus className="ml-2" />
      </button>

      <table className="w-full bg-white rounded shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Mes y Año</th>
            <th className="p-3">Cuenta</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {librosMayores.map((libro) => (
            <tr key={libro.id} className="border-t">
              <td className="p-3">{new Date(libro.fechaOperacion).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</td>
              <td className="p-3">{libro.cuenta?.nombre || "Cuenta no encontrada"}</td>
              <td className="p-3 flex justify-center space-x-3">
                <button className="text-blue-600" onClick={() => handleViewDetails(libro)}>
                  <FaInfoCircle />
                </button>
                <button className="text-yellow-600" onClick={() => handleEdit(libro)}>
                    <FaEdit />
                </button>
                <button className="text-red-600" onClick={() => handleDelete(libro.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

      {/* Modal de Registro */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
            >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-4">Agregar Registro</h2>
                <button 
                onClick={() => setModalOpen(false)} 
                className="text-gray-500 hover:text-gray-800"
                >
                ✖️
                </button>
            </div>
            {/* Selección de Cuenta */}
            <label className="block">Cuenta:</label>
            <select 
                className="border p-2 rounded w-full mb-4" 
                name="cuentaId" 
                value={nuevoRegistro.cuentaId} 
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

            {/* Detalles de la cuenta seleccionada */}
            {cuentaSeleccionada && (
                <div className="bg-gray-100 p-3 rounded mb-4">
                <h3 className="text-lg font-semibold">Detalles de la Cuenta Seleccionada</h3>
                <p><strong>Nombre:</strong> {cuentaSeleccionada.nombre}</p>
                <p><strong>Número:</strong> {cuentaSeleccionada.numero}</p>
                <p><strong>Banco:</strong> {cuentaSeleccionada.banco}</p>
                <p><strong>Saldo Anterior:</strong> ${cuentaSeleccionada.saldo}</p> {/* 🔹 Saldo anterior automático */}
                </div>
            )}

            {/* Tabla de Transacciones */}
            <h3 className="font-semibold mb-2">Detalles de Transacciones</h3>
            <form onSubmit={handleSubmit}>
            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
                <thead>
                <tr className="bg-gray-200 border-b border-gray-300">
                    <th className="p-3 border">Fecha</th>
                    <th className="p-3 border">Descripción</th>
                    <th className="p-3 border">Debe</th>
                    <th className="p-3 border">Haber</th>
                    <th className="p-3 border">Saldo</th>
                    <th className="p-3 border">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {nuevoRegistro.detalles?.map((detalle, index) => (
                    <tr key={index} className="border-t">
                        <td className="p-3 border">
                            <input
                                type="date"
                                value={detalle.fecha}
                                onChange={(e) => handleDetalleChange(index, "fecha", e.target.value)}
                                required
                                className="border p-2 rounded w-full"
                            />
                        </td>
                        <td className="p-3 border">
                            <input
                                type="text"
                                value={detalle.descripcion}
                                onChange={(e) => handleDetalleChange(index, "descripcion", e.target.value)}
                                required
                                className="border p-2 rounded w-full"
                            />
                        </td>
                        <td className="p-3 border">
                            <input
                                type="number"
                                value={detalle.debe}
                                onChange={(e) => handleDetalleChange(index, "debe", e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </td>
                        <td className="p-3 border">
                            <input
                                type="number"
                                value={detalle.haber}
                                onChange={(e) => handleDetalleChange(index, "haber", e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </td>
                        <td className="p-3 border">${Number(detalle.saldo || 0).toFixed(2)}</td>
                        <td className="p-3 border">
                            <button
                                type="button"
                                onClick={() => handleRemoveDetalle(index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition"
                            >
                                ➖
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>

            {/* Botón para agregar una nueva fila */}
            <button 
                type="button" 
                onClick={handleAddDetalle} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition flex items-center justify-center mt-4"
            >
                ➕ Añadir Movimiento
            </button>

            {/* Saldo Final Calculado */}
            <div className="bg-gray-200 p-3 rounded mt-4">
                <p className="text-lg font-bold">Saldo Final: ${nuevoRegistro.saldoFinal}</p>
            </div>

            {/* Botón Guardar */}
            <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg w-full mt-4"
            >
                Guardar
            </button>
            </form>
            </motion.div>
        </div>
        )}

        {detallesOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
            <motion.div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Detalles del Libro Mayor</h2>
                <button onClick={() => setDetallesOpen(false)} className="text-gray-500 hover:text-gray-800">
                ✖️
                </button>
            </div>

            {detallesLibro && detallesLibro.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
                    <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm tracking-wider">
                        <th className="p-2">Fecha Operación</th>
                        <th className="p-2">Descripción</th>
                        <th className="p-2">Debe</th>
                        <th className="p-2">Haber</th>
                        <th className="p-2">Saldo Final</th>
                    </tr>
                    </thead>
                    <tbody>
                    {detallesLibro.map((detalle, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition">
                        <td className="p-2">{new Date(detalle.fechaOperacion).toLocaleDateString("es-ES")}</td>
                        <td className="p-2">{detalle.descripcion}</td>
                        <td className="p-2">{detalle.debe}</td>
                        <td className="p-2">{detalle.haber}</td>
                        <td className="p-2">{detalle.saldoFinal}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                ) : (
                <p className="text-gray-600">No hay detalles disponibles.</p>
                )}

            <button onClick={() => setDetallesOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                Cerrar
            </button>
            </motion.div>
        </div>
        )}
    </div>
  );
};

export default LibroMayorPage;
