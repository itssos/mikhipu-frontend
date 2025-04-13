// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../api/auth";
import { ROUTES } from "../../constants/routes";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("El correo electrónico es requerido.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      setInfo(response); // Mostrar el mensaje de confirmación (ej. "Correo enviado...")
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
        backgroundColor: "#e5dff7"
      }}
    >
      {/* Capa de color semitransparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-200 via-fuchsia-100 to-yellow-100 opacity-55 z-0"></div>
      
      {/* Caja de formulario */}
      <div className="relative z-10 p-8 bg-white bg-opacity-95 rounded-3xl shadow-2xl w-96 border border-gray-200">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-purple-800">Olvidaste tu Contraseña</h2>
          <h3 className="font-semibold text-gray-700 mt-1">Recupera tu acceso</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full text-sm px-4 py-3 bg-gray-100 focus:bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {info && <p className="text-green-500 text-sm">{info}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center bg-purple-700 hover:bg-purple-600 text-white p-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Cargando..." : "Enviar enlace de recuperación"}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to={ROUTES.LOGIN} className="text-purple-600 hover:text-purple-500 ml-auto">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
