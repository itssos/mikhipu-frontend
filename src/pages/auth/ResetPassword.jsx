// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import { ROUTES } from "../../constants/routes";

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
      // Después de mostrar el modal, redirigir al login en 3 segundos
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
        // Elimina la imagen si prefieres solo el gradiente retro
        backgroundImage: 'url("/fondo-escolar.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f6ecd6"
      }}
    >
      {/* Capa pergamino semitransparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f9efd4] via-[#f3e5c1] to-[#fffad1] opacity-70 z-0"></div>

      {/* Caja adventure */}
      <div className="relative z-10 adventure-login-card w-full max-w-md mx-4">
        <div className="mb-6 text-center">
          <h2 className="adventure-title text-2xl mb-1 text-yellow-800 drop-shadow">Restablecer Contraseña</h2>
          <h3 className="font-semibold text-yellow-700 text-base">Ingresa tu nueva contraseña</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Nueva Contraseña"
              className="adventure-input w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              className="adventure-input w-full"
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
              className="adventure-btn-primary w-full"
            >
              {isLoading ? "Cargando..." : "Restablecer Contraseña"}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <Link to={ROUTES.LOGIN} className="adventure-link ml-auto">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>

      {/* Modal de éxito retro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#fffbe8ee] rounded-2xl shadow-2xl border-2 border-[#f6e3b2] max-w-sm w-full mx-4 p-8 text-center adventure-modal-retro">
            <h2 className="adventure-title text-2xl mb-2 text-yellow-800">¡Éxito!</h2>
            <p className="text-yellow-900 mb-4 font-semibold">{modalMessage}</p>
            <p className="text-sm text-gray-500 italic">Serás redirigido al inicio de sesión...</p>
          </div>
        </div>
      )}

      <style>{`
      .adventure-login-card {
        padding: 2.2rem 2rem;
        background: #fffbe8ee;
        border: 2.7px solid #f6e3b2;
        border-radius: 22px;
        box-shadow: 0 6px 40px #eddec4cc, 0 1.5px 0 #edd19a;
        font-family: 'Georgia', serif;
        min-width: 320px;
      }
      .adventure-title {
        font-family: 'Cinzel', 'Georgia', serif;
        font-weight: bold;
        letter-spacing: 0.03em;
        color: #a6821c;
        text-shadow: 0 1.2px 0 #f9efc1, 0 2.5px 7px #edd6a2;
      }
      .adventure-input {
        background: #fff9ed;
        border: 1.4px solid #e6d2a5;
        border-radius: 12px;
        font-family: 'Georgia', serif;
        padding: 11px 15px;
        font-size: 1em;
        color: #95702a;
        box-shadow: 0 1px 3px #edd7b444;
        transition: border 0.13s;
      }
      .adventure-input:focus {
        outline: none;
        border: 1.7px solid #b89325;
        background: #fff6d8;
      }
      .adventure-btn-primary {
        background: linear-gradient(90deg, #ecd18c 10%, #b89325 90%);
        color: #5e4209;
        border: none;
        border-radius: 12px;
        font-family: 'Georgia', serif;
        font-weight: bold;
        padding: 13px 0;
        font-size: 1rem;
        box-shadow: 0 2px 9px #ecd99a44;
        transition: background .13s, color .13s, box-shadow .13s;
      }
      .adventure-btn-primary:hover {
        background: linear-gradient(90deg, #ffe7b4 10%, #c09d34 90%);
        color: #7d640c;
        box-shadow: 0 4px 18px #edd19a33;
      }
      .adventure-link {
        color: #b89325;
        text-decoration: underline;
        transition: color 0.13s;
        font-weight: bold;
      }
      .adventure-link:hover {
        color: #cfab3a;
      }
      .adventure-modal-retro {
        border-radius: 24px;
        font-family: 'Georgia', serif;
        border: 2.5px solid #e4c981;
        background: #fffbe6;
        box-shadow: 0 2px 12px #e6cd7b33;
      }
    `}</style>
    </div>
  );

}
