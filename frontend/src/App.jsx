import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import PropTypes from "prop-types"; // 🔹 Importamos PropTypes
import useAuth from "./context/useAuth";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./dashboard/Dashboard";
import UsuariosPage from "./pages/UsuariosPage";
import Login from "./pages/auth/Login";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// 🔹 Validamos `children` con PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// 🔹 También validamos `AuthProvider` en su propio archivo (si es necesario)
export default App;
