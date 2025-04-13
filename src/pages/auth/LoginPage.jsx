// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError("El nombre de usuario es requerido.");
      return;
    }
    if (!password) {
      setError("La contraseña es requerida.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await login({ username, password });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div
      className="relative min-h-screen flex justify-center items-center overflow-hidden"
      style={{
        backgroundImage: 'url("/fondo-escolar.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#e5dff7" // Fondo de respaldo intermedio
      }}
    >
      {/* Capa de color semitransparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-200 via-fuchsia-100 to-yellow-100 opacity-55 z-0"></div>

      {/* Caja de login responsive */}
      <div className="relative z-10 p-8 bg-white bg-opacity-95 rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-gray-200">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-purple-800">Bienvenido a MiKhipu🎒</h2>
          <h3 className="font-semibold text-gray-700 mt-1">Inicie Sesión</h3>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              className="w-full text-sm px-4 py-3 bg-gray-100 focus:bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
            />
          </div>
          <div className="relative">
            <input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm text-gray-600 px-4 py-3 rounded-lg bg-gray-100 focus:bg-white border border-gray-300 focus:outline-none focus:border-purple-400"
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-purple-600 hover:text-purple-500 ml-auto">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center bg-purple-700 hover:bg-purple-600 text-white p-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Cargando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
