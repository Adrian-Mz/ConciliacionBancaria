import { useEffect, useState } from "react";
import { cuentaBancariaAPI } from "../../api/api.cuentaBancaria";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const CuentasBancariasPage = () => {
  const [cuentas, setCuentas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [cuentaAEliminar, setCuentaAEliminar] = useState(null);
  const [cuentaActual, setCuentaActual] = useState({
    id: null,
    nombre: "",
    banco: "",
    numero: "",
    saldo: 0,
    usuarioId: null, // 🔹 Se agregará el usuarioId automáticamente
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCuentaActual({ ...cuentaActual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Obtener usuarioId desde localStorage
      const usuario = JSON.parse(localStorage.getItem("user"));
      if (!usuario || !usuario.id) {
        console.error("No se encontró usuario en localStorage");
        return;
      }

      if (!cuentaActual.nombre || !cuentaActual.numero || !cuentaActual.banco) {
        console.error("Faltan datos obligatorios");
        return;
      }

      const nuevaCuenta = {
        nombre: cuentaActual.nombre,
        banco: cuentaActual.banco,
        numero: cuentaActual.numero,
        saldo: parseFloat(cuentaActual.saldo) || 0,
        usuarioId: usuario.id, // 🔹 Se asigna el usuarioId al crear la cuenta
      };

      if (editando) {
        await cuentaBancariaAPI.updateCuenta(cuentaActual.id, nuevaCuenta);
      } else {
        await cuentaBancariaAPI.createCuenta(nuevaCuenta);
      }

      setModalOpen(false);
      setEditando(false);
      cargarCuentas();
    } catch (error) {
      console.error("Error al guardar cuenta bancaria:", error);
    }
  };

  const handleEditar = (cuenta) => {
    setCuentaActual({ ...cuenta });
    setEditando(true);
    setModalOpen(true);
  };

  const handleEliminar = async () => {
    if (!cuentaAEliminar) return;
    try {
      await cuentaBancariaAPI.deleteCuenta(cuentaAEliminar.id);
      cargarCuentas();
    } catch (error) {
      console.error("Error al eliminar cuenta bancaria:", error);
    } finally {
      setModalConfirmOpen(false);
      setCuentaAEliminar(null);
    }
  };

  const handleConfirmarEliminar = (cuenta) => {
    setCuentaAEliminar(cuenta);
    setModalConfirmOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditando(false);
    setCuentaActual({ id: null, nombre: "", banco: "", numero: "", saldo: 0 });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cuentas Bancarias</h2>
      <button
        onClick={() => {
          setCuentaActual({ nombre: "", banco: "", numero: "", saldo: 0 });
          setEditando(false);
          setModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center mb-4"
      >
        <FaPlus className="mr-2" /> Agregar Cuenta
      </button>

      <table className="w-full bg-white rounded shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Nombre</th>
            <th className="p-3">Banco</th>
            <th className="p-3">Número</th>
            <th className="p-3">Saldo</th>
            <th className="p-3">Saldo Banco</th>
            <th className="p-3">Saldo Libro</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta) => (
            <tr key={cuenta.id} className="border-t">
              <td className="p-3">{cuenta.nombre}</td>
              <td className="p-3">{cuenta.banco}</td>
              <td className="p-3">{cuenta.numero}</td>
              <td className="p-3">${cuenta.saldo}</td>
              <td className="p-3">${cuenta.saldoBanco}</td>
              <td className="p-3">${cuenta.saldoLibro}</td>
              <td className="p-3 flex space-x-3">
                <button className="text-yellow-600" onClick={() => handleEditar(cuenta)}>
                  <FaEdit />
                </button>
                <button className="text-red-600" onClick={() => handleConfirmarEliminar(cuenta)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editando ? "Editar Cuenta" : "Agregar Cuenta"}</h2>
              <button onClick={handleCerrarModal} className="text-gray-500 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="block font-semibold">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={cuentaActual.nombre}
                onChange={handleInputChange}
                required
                className="border p-2 rounded w-full mb-3"
              />

              <label className="block font-semibold">Banco:</label>
              <input
                type="text"
                name="banco"
                value={cuentaActual.banco}
                onChange={handleInputChange}
                required
                className="border p-2 rounded w-full mb-3"
              />

              <label className="block font-semibold">Número de Cuenta:</label>
              <input
                type="text"
                name="numero"
                value={cuentaActual.numero}
                onChange={handleInputChange}
                required
                className="border p-2 rounded w-full mb-3"
              />

              <label className="block font-semibold">Saldo Inicial:</label>
              <input
                type="number"
                name="saldo"
                value={cuentaActual.saldo}
                onChange={handleInputChange}
                required
                className="border p-2 rounded w-full mb-3"
              />

              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
                {editando ? "Actualizar" : "Guardar"}
              </button>

              <button
                type="button"
                onClick={handleCerrarModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full mt-2"
              >
                Cancelar
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {modalConfirmOpen && cuentaAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Confirmar Eliminación</h2>
              <button onClick={() => setModalConfirmOpen(false)} className="text-gray-500 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600">¿Estás seguro de que deseas eliminar la cuenta bancaria <strong>{cuentaAEliminar.nombre}</strong>?</p>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setModalConfirmOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
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

export default CuentasBancariasPage;
