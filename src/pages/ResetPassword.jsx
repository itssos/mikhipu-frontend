// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/auth";
import { ROUTES } from "../constants/routes";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!newPassword) {
      setError("La nueva contraseña es requerida.");
      return false;
    }
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Token de recuperación no válido o ausente.");
      return;
    }
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await resetPassword({ token, newPassword });
      setModalMessage(response);
      setShowModal(true);
      setError("");
      // Después de mostrar el modal se redirige al login
      setTimeout(() => {
        setShowModal(false);
        navigate(ROUTES.LOGIN);
      }, 3000);
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
          <h2 className="text-xl font-bold text-purple-800">Restablecer Contraseña</h2>
          <h3 className="font-semibold text-gray-700 mt-1">Ingresa tu nueva contraseña</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Nueva Contraseña"
              className="w-full text-sm px-4 py-3 bg-gray-100 focus:bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              className="w-full text-sm px-4 py-3 bg-gray-100 focus:bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center bg-purple-700 hover:bg-purple-600 text-white p-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Cargando..." : "Restablecer Contraseña"}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to={ROUTES.LOGIN} className="text-purple-600 hover:text-purple-500 ml-auto">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>

      {/* Modal de Éxito */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-purple-800 mb-4">Éxito</h2>
            <p className="text-gray-700 mb-4">{modalMessage}</p>
            <p className="text-sm text-gray-500">Serás redirigido al inicio de sesión...</p>
          </div>
        </div>
      )}
    </div>
  );
}
