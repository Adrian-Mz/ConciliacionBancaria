import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import PropTypes from "prop-types"; 
import useAuth from "./context/useAuth";
import MainLayout from "./layouts/MainLayout";

// Páginas
import Dashboard from "./dashboard/Dashboard";
import UsuariosPage from "./pages/Admin/UsuariosPage";
import GestionRoles from "./pages/Admin/GestionRoles";

// Contador
import CuentasBancariasPage from "./pages/Contador/CuentasBancariasPage";
import MovimientoCuentaPage from "./pages/Contador/MovimientoCuentaPage";
import GenerarConciliacionPage from "./pages/Contador/GenerarConciliacionPage";
import LibroMayorPage from "./pages/Contador/LibroMayorPage";

// Auditor
import RevisarConciliacionesPage from "./pages/auditor/RevisarConciliacionesPage";

// Director Contable
import AprobarConciliacionesPage from "./pages/Director/AprobarConciliacionesPage";

// Gerente
import HistorialConciliacionesPage from "./pages/Gerente/HistorialConciliacionesPage";

// Autenticación
import Login from "./pages/auth/Login";

// Componente de Rutas Protegidas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" />;  // Si no hay usuario, redirige al login

  if (allowedRoles && !allowedRoles.includes(user.rolId)) {
    return <Navigate to="/dashboard" />; // Si el rol no está autorizado, redirige al dashboard
  }

  return children;
};

// Validación de Props
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.number),
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Login />} />

          {/* Rutas Protegidas con Layout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Administrador */}
            <Route path="/usuarios" element={<ProtectedRoute allowedRoles={[1]}><UsuariosPage /></ProtectedRoute>} />
            <Route path="/roles" element={<ProtectedRoute allowedRoles={[1]}><GestionRoles /></ProtectedRoute>} />

            {/* Contador */}
            <Route path="/cuentas-bancarias" element={<ProtectedRoute allowedRoles={[4]}><CuentasBancariasPage /></ProtectedRoute>} />
            <Route path="/estados-cuenta" element={<ProtectedRoute allowedRoles={[4]}><MovimientoCuentaPage /></ProtectedRoute>} />
            <Route path="/libros-mayor" element={<ProtectedRoute allowedRoles={[4]}><LibroMayorPage /></ProtectedRoute>} />
            <Route path="/generar-conciliacion" element={<ProtectedRoute allowedRoles={[4]}><GenerarConciliacionPage /></ProtectedRoute>} />

            {/* Auditor */}
            <Route path="/revisar-conciliaciones" element={<ProtectedRoute allowedRoles={[2]}><RevisarConciliacionesPage /></ProtectedRoute>} />

            {/* Director Contable */}
            <Route path="/aprobar-conciliaciones" element={<ProtectedRoute allowedRoles={[3]}><AprobarConciliacionesPage /></ProtectedRoute>} />

            {/* Gerente */}
            <Route path="/historial-conciliaciones" element={<ProtectedRoute allowedRoles={[5]}><HistorialConciliacionesPage /></ProtectedRoute>} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
