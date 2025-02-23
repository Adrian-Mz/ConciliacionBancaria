import { useEffect, useState } from "react";
import { usuarioAPI } from "../api/api.usuarios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rolId, setRolId] = useState(2);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await usuarioAPI.getAllUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
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
      setNombre("");
      setCorreo("");
      setContraseña("");
      setRolId(2);
      setEditId(null);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleEdit = (usuario) => {
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setRolId(usuario.rolId);
    setEditId(usuario.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await usuarioAPI.deleteUsuario(id);
        cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="border p-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            className="border p-2 rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border p-2 rounded"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          <select
            value={rolId}
            onChange={(e) => setRolId(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Usuario</option>
            <option value={3}>Auditor</option>
            <option value={4}>Director</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded flex items-center justify-center">
            {editId ? "Actualizar" : "Agregar"} <FaPlus className="ml-2" />
          </button>
        </div>
      </form>

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
              <td className="p-3">{usuario.rol.nombre}</td>
              <td className="p-3 flex justify-center space-x-4">
                <button onClick={() => handleEdit(usuario)} className="text-yellow-600">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(usuario.id)} className="text-red-600">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosPage;
