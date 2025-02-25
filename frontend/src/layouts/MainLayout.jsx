import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import Header from "../components/Header";
import Chatbot from "../components/ChatBot";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [rolId, setRolId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRolId(user.rolId);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar rolId={rolId} />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Contenido dinámico */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
          <Chatbot />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
