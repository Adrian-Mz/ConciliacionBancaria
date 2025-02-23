import { useEffect, useState } from "react";
import { usuarioAPI } from "../../api/api.usuarios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Si ya hay usuario en localStorage, redirigir directamente al dashboard
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await usuarioAPI.login(correo, password);
      console.log("Datos del usuario recibido:", data);

      if (data && data.usuario) {
        // 🔹 Guardamos usuario y token
        localStorage.setItem("user", JSON.stringify(data.usuario));
        localStorage.setItem("token", data.token);
        
        console.log("Usuario guardado en localStorage:", localStorage.getItem("user"));

        // 🔹 Redirigir al dashboard
        navigate("/dashboard");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.log("Error al autenticar:", error);
      setError("Error en la autenticación");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Iniciar Sesión
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-900">
              Correo Electrónico
            </label>
            <div className="mt-2">
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Contraseña
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
