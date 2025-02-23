import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-white shadow flex justify-between items-center p-4">
      <h1 className="text-xl font-bold">Conciliación Bancaria</h1>

      <div className="flex items-center space-x-4">
        <span className="font-medium">{user ? user.nombre : "Usuario"}</span>
        <FaUserCircle className="w-6 h-6 text-gray-600" />

        <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
          <FaSignOutAlt className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
