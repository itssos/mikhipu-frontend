import React from "react";
import HorizontalNavBar from "./HorizontalNavBar";
import BalloonGame from "./BalloonGame";

const Layout = ({ children }) => {
  return (
    <div className="adventure-bg">
      {/* HEADER */}
      <header className="adventure-header">
        <div className="adventure-header-inner">
          <HorizontalNavBar />
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="adventure-main">
        <div className="panel-adventure">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="adventure-footer">
        <div className="adventure-footer-inner">
          <span>
            &copy; {new Date().getFullYear()} <span className="adventure-footer-brand">MiKhipu</span>
            . Todos los derechos reservados.
          </span>
          <BalloonGame />
        </div>
      </footer>

      {/* Estilos adventure para Layout */}
      <style>{`
        .adventure-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #647057 0%, #2a3622 100%);
          font-family: 'Pirata One', cursive, serif;
          letter-spacing: 0.5px;
          color: #3d3219;
          display: flex;
          flex-direction: column;
        }
        .adventure-header {
          background: linear-gradient(90deg, #a87e42 0%, #d1ba6b 100%);
          border-bottom: 6px solid #68522b;
          padding: 0;
          font-family: 'Pirata One', cursive, serif;
          font-size: 1.6rem;
          box-shadow: 0 4px 12px #4c3a13a0;
        }
        .adventure-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1250px;
          margin: 0 auto;
          padding: 22px 28px 17px 28px;
        }
        .adventure-logo {
          font-size: 2.1rem;
          margin: 0 14px;
          text-shadow: 2px 3px #8a7e56, 0 2px #fffbe6;
        }
        .adventure-main {
          flex-grow: 1;
          max-width: 1200px;
          margin: 36px auto 0 auto;
          width: 98%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .panel-adventure {
          background: #b6a077 url('https://www.transparenttextures.com/patterns/wood-pattern.png');
          border: 8px solid #574d32;
          border-radius: 22px 22px 35px 35px;
          box-shadow: 0 0 28px #000a;
          padding: 44px 38px 44px 38px;
          min-height: 480px;
          margin-bottom: 38px;
        }
        .adventure-footer {
          background: linear-gradient(90deg, #a87e42 0%, #d1ba6b 100%);
          border-top: 5px solid #8a7e56;
          color: #fff8c4;
          font-family: 'Pirata One', cursive, serif;
          font-size: 1.1rem;
          box-shadow: 0 -2px 16px #4c3a13a2;
        }
        .adventure-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px 13px 28px;
          min-height: 55px;
        }
        .adventure-footer-brand {
          font-family: 'Pirata One', cursive, serif;
          font-size: 1.2em;
          color: #3d3219;
          text-shadow: 1.5px 1.5px #fff7ad, 1.5px 2px #ad9c62;
          margin-left: 2px;
        }
        @media (max-width: 700px) {
          .adventure-header-inner, .adventure-footer-inner, .adventure-main {
            padding-left: 8px; padding-right: 8px;
          }
          .panel-adventure { padding: 15px 4px; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
