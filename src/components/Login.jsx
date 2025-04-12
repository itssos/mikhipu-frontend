import { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function LoginApp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña.");
    } else {
      setError("");
      // Aquí iría la lógica del login, pero se omite por solicitud
      alert("Login simulado.");
    }
  };

  /* return (
    <>
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden"></div>

      <div className="relative min-h-screen flex justify-center items-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="text-center font-semibold text-2xl text-gray-800">
                Inicie Sesión
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <input
                  placeholder="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm text-gray-600 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                />
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm ml-auto">
                  <a href="#" className="text-purple-500 hover:text-purple-400">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                >
                  Ingresar
                </button>
              </div>
            </div>
          </div>
        </div>

        <Spline
          className="absolute bottom-0 left-0 z-0"
          scene="https://prod.spline.design/9euumdwLgxR0tlgr/scene.splinecode"
        />
      </div>

      <footer className="bg-transparent absolute w-full bottom-0 left-0 z-30">
        <div className="container p-5 mx-auto flex items-center justify-between"></div>
      </footer>

      <svg
        className="absolute bottom-0 left-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </>
  );*/
  return (
    <div
      className="relative min-h-screen flex justify-center items-center overflow-hidden"
      style={{
        backgroundImage: 'url("/fondo-escolar.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#e5dff7", // 🎨 Fondo de respaldo intermedio
      }}
    >
      {/* Capa de color semitransparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-200 via-fuchsia-100 to-yellow-100 opacity-55 z-0"></div>

      {/* Caja de login */}
      <div className="relative z-10 p-8 bg-white bg-opacity-95 rounded-3xl shadow-2xl w-96 border border-gray-200">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-purple-800">Bienvenido a MiKhipu🎒</h2>
          <h3 className="font-semibold text-gray-700 mt-1">Inicie Sesión</h3>
        </div>

        <div className="space-y-6">
          <div>
            <input
              className="w-full text-sm px-4 py-3 bg-gray-100 focus:bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm text-gray-600 px-4 py-3 rounded-lg w-full bg-gray-100 focus:bg-white border border-gray-300 focus:outline-none focus:border-purple-400"
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-purple-600 hover:text-purple-500 ml-auto">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full flex justify-center bg-purple-700 hover:bg-purple-600 text-white p-3 rounded-lg font-semibold transition duration-300"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
