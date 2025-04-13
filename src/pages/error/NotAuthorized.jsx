
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function NotAuthorized() {
  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden"
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
      
      {/* Caja del 404 */}
      <div className="relative z-10 p-8 bg-white bg-opacity-95 rounded-3xl shadow-2xl w-96 border border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Autorizado</h2>
        <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
        <Link to={ROUTES.DASHBOARD} className="text-purple-600 hover:text-purple-500 font-semibold">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
