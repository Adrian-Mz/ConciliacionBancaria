import { useEffect, useState } from "react";
import { rolAPI } from "../../api/api.rol";

const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    cargarRoles();
  }, []);

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
      await rolAPI.createRol({ nombre });
      setNombre("");
      cargarRoles();
    } catch (error) {
      console.error("Error al crear rol:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Roles</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Nombre del rol"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border p-2 rounded mr-2"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Agregar Rol</button>
      </form>

      <ul className="bg-white rounded shadow p-4">
        {roles.map((rol) => (
          <li key={rol.id} className="border-b p-2">{rol.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default GestionRoles;
