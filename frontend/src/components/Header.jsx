import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { rolAPI } from "../api/api.rol"; // 🔹 Importamos la API de roles

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [rolNombre, setRolNombre] = useState("Cargando...");

  useEffect(() => {
    const obtenerRol = async () => {
      if (user?.rolId) {
        try {
          const rolData = await rolAPI.getRolById(user.rolId);
          setRolNombre(rolData.nombre); // 🔹 Extraemos el nombre del rol
        } catch (error) {
          console.error("Error al obtener el rol:", error);
          setRolNombre("Sin Rol"); // 🔹 En caso de error, mostramos "Sin Rol"
        }
      } else {
        setRolNombre("Sin Rol");
      }
    };

    obtenerRol();
  }, [user?.rolId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-white shadow flex justify-between items-center p-4">
      <h1 className="text-xl font-bold">Conciliación Bancaria</h1>

      <div className="flex items-center space-x-4">
        <span className="font-medium">
          {user ? `${user.nombre} (${rolNombre})` : "Usuario"}
        </span>
        <FaUserCircle className="w-6 h-6 text-gray-600" />

        <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
          <FaSignOutAlt className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
