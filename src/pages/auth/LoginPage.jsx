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
      className="adventure-login-bg min-h-screen flex justify-center items-center"
      style={{
        background: "linear-gradient(135deg, #647057 0%, #2a3622 100%)",
        minHeight: "100vh",
        fontFamily: "'Pirata One', 'Press Start 2P', cursive, monospace"
      }}
    >
      {/* Panel de login tipo tablilla */}
      <div
        className="adventure-login-panel w-full max-w-md mx-4"
        style={{
          border: "8px solid #604d18",
          borderRadius: "34px 34px 38px 44px",
          background: "#ede2c3 url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
          boxShadow: "0 0 40px #573f139a",
          padding: "38px 30px 32px 30px",
          zIndex: 5,
        }}
      >
        <div className="mb-7 text-center">
          <h2
            style={{
              fontFamily: "'Pirata One', cursive",
              fontSize: 28,
              letterSpacing: 2,
              color: "#614713",
              textShadow: "2px 3px #fffbe6, 0 3px #ad9c62",
              marginBottom: 8,
            }}
          >
            🎒 MiKhipu
          </h2>
          <h3
            style={{
              fontSize: 19,
              color: "#523812",
              fontFamily: "'Pirata One', cursive",
              marginTop: 3,
              marginBottom: 5,
              letterSpacing: 0.6,
              textShadow: "1px 2px #f9ebd3, 0 2px #e2c694",
            }}
          >
            Inicia tu Aventura
          </h3>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <input
              className="adventure-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="👤 Usuario"
              autoFocus
              style={{
                width: "100%",
                fontFamily: "'Pirata One', cursive",
                fontSize: 16,
              }}
            />
          </div>
          <div>
            <input
              className="adventure-input"
              placeholder="🔑 Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: "100%",
                fontFamily: "'Pirata One', cursive",
                fontSize: 16,
              }}
            />
            {error && (
              <div
                style={{
                  background: "linear-gradient(90deg,#ffd8d0 60%,#ffa6a6 100%)",
                  color: "#9c2715",
                  border: "2.5px solid #ff4646",
                  borderRadius: 11,
                  fontWeight: "bold",
                  marginTop: 9,
                  fontFamily: "'Pirata One', cursive",
                  fontSize: 15,
                  padding: "7px 12px"
                }}
              >
                {error}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              style={{
                color: "#af5ed9",
                textDecoration: "underline dotted",
                fontFamily: "'Pirata One', cursive",
                fontSize: 14,
                marginLeft: "auto",
              }}
              className="hover:text-fuchsia-500"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-adventure"
              style={{
                width: "100%",
                background: "linear-gradient(120deg, #dac382 60%, #95702a 100%)",
                color: "#4d2d00",
                border: "3.5px solid #604d18",
                fontFamily: "'Pirata One', cursive",
                fontSize: 19,
                padding: "14px 0",
                borderRadius: 15,
                marginTop: 12,
                boxShadow: "2px 4px #b9a97e, 1px 1px 7px #4e3d1060",
                textShadow: "1px 1px #fff7ad",
                outline: "none",
                transition: "all 0.13s",
              }}
            >
              {isLoading ? "Entrando al templo..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
      .adventure-login-bg {
  background: linear-gradient(135deg, #647057 0%, #2a3622 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.adventure-login-panel {
  /* Ya dado en el style inline, puedes añadir más si lo necesitas */
}

.adventure-input {
  border-radius: 10px;
  border: 2.3px solid #ad9c62;
  background: #f6ecd1;
  font-family: 'Pirata One', cursive;
  font-size: 17px;
  color: #5c430f;
  padding: 12px 16px;
  margin-bottom: 3px;
  outline: none;
  box-shadow: 1.5px 2.5px #ccb97b;
  transition: border 0.12s;
}
.adventure-input:focus {
  border: 2.5px solid #604d18;
  background: #fffbe6;
}
.btn-adventure {
  background: linear-gradient(120deg, #dac382 60%, #95702a 100%);
  border: 3px solid #604d18;
  border-radius: 13px 20px 13px 13px;
  font-family: 'Pirata One', cursive;
  font-size: 17px;
  color: #3c2d0e;
  cursor: pointer;
  padding: 9px 16px;
  box-shadow: 2px 4px #b9a97e, 1px 1px 5px #4e3d10bb;
  margin-right: 6px;
  margin-bottom: 2px;
  text-shadow: 1px 1px #fff7ad;
  outline: none;
  transition: all 0.13s;
}
.btn-adventure:hover {
  background: #ffecc5 !important;
  color: #a2782d !important;
  transform: scale(1.04);
}
.btn-adventure:active {
  background: #a38a47 !important;
  color: #fff5b6 !important;
}
      `}</style>
    </div>
  );
}
