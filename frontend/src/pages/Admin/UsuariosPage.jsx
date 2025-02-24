import { useEffect, useState } from "react";
import { usuarioAPI } from "../../api/api.usuarios";
import { rolAPI } from "../../api/api.rol";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rolId, setRolId] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await usuarioAPI.getAllUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const cargarRoles = async () => {
    try {
      const data = await rolAPI.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await usuarioAPI.updateUsuario(editId, { nombre, correo, contraseña, rolId });
      } else {
        await usuarioAPI.createUsuario({ nombre, correo, contraseña, rolId });
      }
      closeModal();
      cargarUsuarios();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleEdit = (usuario) => {
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setRolId(usuario.rol?.id || ""); // Corregido para evitar errores
    setEditId(usuario.id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await usuarioAPI.deleteUsuario(selectedUser.id);
      setDeleteModalOpen(false);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const openDeleteModal = (usuario) => {
    setSelectedUser(usuario);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDeleteModalOpen(false);
    setEditId(null);
    setNombre("");
    setCorreo("");
    setContraseña("");
    setRolId("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center mb-4"
      >
        Agregar Usuario <FaPlus className="ml-2" />
      </button>

      <table className="w-full bg-white rounded shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Rol</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t">
              <td className="p-3 text-center">{usuario.id}</td>
              <td className="p-3">{usuario.nombre}</td>
              <td className="p-3">{usuario.correo}</td>
              <td className="p-3">{usuario.rol?.nombre || "Sin rol"}</td>
              <td className="p-3 flex justify-center space-x-4">
                <button onClick={() => handleEdit(usuario)} className="text-yellow-600">
                  <FaEdit />
                </button>
                <button onClick={() => openDeleteModal(usuario)} className="text-red-600">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Agregar/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-6 rounded shadow-lg w-1/3 border border-gray-300"
          >
            <h2 className="text-xl font-bold mb-4">{editId ? "Editar Usuario" : "Agregar Usuario"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                className="border p-2 rounded w-full"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo"
                className="border p-2 rounded w-full"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="border p-2 rounded w-full"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required={!editId}
              />
              <select
                value={rolId}
                onChange={(e) => setRolId(Number(e.target.value))}
                className="border p-2 rounded w-full"
              >
                <option value="">Seleccionar Rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editId ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-6 rounded shadow-lg w-1/3 border border-gray-300"
          >
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar a <b>{selectedUser?.nombre}</b>?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
