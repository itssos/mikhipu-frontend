
import React from "react";
import HorizontalNavBar from "./HorizontalNavBar";

const Layout = ({ children }) => {


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header con navbar */}
      <header className="text-white">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center">
          <HorizontalNavBar />
        </div>
      </header>

      {/* Área de contenido */}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-100 py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} MiKhipu. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
