import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaCog, FaSignOutAlt, FaClipboardList } from "react-icons/fa";

const Sidebar = ({ rolId }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-gray-900 text-white flex flex-col transition-all duration-300`}>
      {/* Encabezado del Sidebar */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
        {isOpen && <h1 className="text-xl font-bold">Conciliación</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
          ☰
        </button>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 px-4 py-5">
        <Link to="/dashboard" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
          <FaHome className="w-6 h-6" />
          {isOpen && <span>Dashboard</span>}
        </Link>

        {rolId === 1 && (
          <>
            <Link to="/usuarios" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
              <FaUsers className="w-6 h-6" />
              {isOpen && <span>Gestión de Usuarios</span>}
            </Link>
            <Link to="/roles" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
              <FaCog className="w-6 h-6" />
              {isOpen && <span>Gestión de Roles</span>}
            </Link>
          </>
        )}

        {rolId === 4 && (
          <>
            <Link to="/cuentas-bancarias" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
              <FaClipboardList className="w-6 h-6" />
              {isOpen && <span>Cuentas Bancarias</span>}
            </Link>
            <Link to="/estados-cuenta" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
              <FaClipboardList className="w-6 h-6" />
              {isOpen && <span>Estados de Cuenta</span>}
            </Link>
            <Link to="/generar-conciliacion" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
              <FaClipboardList className="w-6 h-6" />
              {isOpen && <span>Generar Conciliación</span>}
            </Link>
          </>
        )}

        {rolId === 2 && (
          <Link to="/revisar-conciliaciones" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
            <FaClipboardList className="w-6 h-6" />
            {isOpen && <span>Revisar Conciliaciones</span>}
          </Link>
        )}

        {rolId === 3 && (
          <Link to="/aprobar-conciliaciones" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
            <FaClipboardList className="w-6 h-6" />
            {isOpen && <span>Aprobar Conciliaciones</span>}
          </Link>
        )}

        {rolId === 5 && (
          <Link to="/historial-conciliaciones" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
            <FaClipboardList className="w-6 h-6" />
            {isOpen && <span>Historial de Conciliaciones</span>}
          </Link>
        )}
      </nav>

      {/* Cerrar Sesión */}
      <Link to="/" className="flex items-center space-x-2 p-3 hover:bg-red-700 rounded">
        <FaSignOutAlt className="w-6 h-6" />
        {isOpen && <span>Cerrar Sesión</span>}
      </Link>
    </div>
  );
};

Sidebar.propTypes = {
  rolId: PropTypes.number.isRequired,
};

export default Sidebar;
