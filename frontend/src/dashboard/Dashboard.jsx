import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [rolId, setRolId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
    } else {
      setRolId(user.rolId);
    }
  }, [navigate]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar rolId={rolId} />

      {/* Contenido Principal */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold">Conciliaciones Pendientes</h2>
            <p className="text-3xl font-bold">12</p>
            <p className="text-gray-500">Requieren revisión.</p>
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold">Usuarios Registrados</h2>
            <p className="text-3xl font-bold">34</p>
            <p className="text-gray-500">Usuarios en el sistema.</p>
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold">Reportes Generados</h2>
            <p className="text-3xl font-bold">8</p>
            <p className="text-gray-500">Últimos reportes.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
