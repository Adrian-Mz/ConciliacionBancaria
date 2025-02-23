const Dashboard = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg">Conciliaciones Pendientes</h3>
            <p className="text-3xl font-bold">12</p>
            <p className="text-gray-500">Requieren revisión.</p>
          </div>
  
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg">Usuarios Registrados</h3>
            <p className="text-3xl font-bold">34</p>
            <p className="text-gray-500">Usuarios en el sistema.</p>
          </div>
  
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg">Reportes Generados</h3>
            <p className="text-3xl font-bold">8</p>
            <p className="text-gray-500">Últimos reportes.</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  