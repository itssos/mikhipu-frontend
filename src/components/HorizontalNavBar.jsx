import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { NAV_CONFIG } from "../constants/navConfig";
import { Bars3Icon, PowerIcon } from "@heroicons/react/24/outline";

export default function HorizontalNavBar() {
  const { user, logout } = useAuth();
  const userRoles = user?.role || [];
  const userPermissions = user?.permissions || [];
  const navItems = NAV_CONFIG.filter(item => {
    if (!item.roles && !item.permissions) return true;
    if (item.roles && item.roles.some(role => userRoles.includes(role))) return true;
    if (item.permissions && item.permissions.some(perm => userPermissions.includes(perm))) return true;
    return false;
  });

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="adventure-navbar"
      style={{
        padding: 0,
        borderRadius: 20,
        width: "100%",
        background: "linear-gradient(90deg, #e1c894 0%, #b6a077 100%)",
        boxShadow: "0 2px 12px #b7a75170",
        fontFamily: "'Pirata One', cursive",
        marginBottom: 0,
        minHeight: 62,
        position: "relative",
      }}
    >
      <div
        className="adventure-navbar-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
          padding: "0 24px",
        }}
      >
        {/* Logo / título */}
        <div
          className="adventure-logo"
          style={{
            fontSize: "1.6em",
            color: "#5c430f",
            fontWeight: 800,
            textShadow: "2px 2px #fff8c4, 0 2px #ad9c62",
            letterSpacing: "2px",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          🏛️ MiKhipu
        </div>

        {/* Botón hamburger móvil */}
        <div className="sm:hidden" style={{ display: "block" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn-adventure-icon"
            style={{
              padding: 9,
              borderRadius: 12,
              background: "linear-gradient(90deg, #dac382 60%, #a87e42 100%)",
              boxShadow: "0 1.5px 4px #ad9c6244",
            }}
            aria-label="Abrir menú"
          >
            <Bars3Icon className="h-7 w-7 text-[#8a7e56]" />
          </button>
        </div>

        {/* Menú horizontal */}
        <ul
          className="adventure-nav-list"
          style={{
            display: "none",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {/* visible en desktop (simula sm:flex) */}
        </ul>
        <div
          className="adventure-nav-desktop"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          {navItems.map(({ name, path, Icon }) => (
            <Link to={path} key={name} style={{ textDecoration: "none" }}>
              <button
                className="btn-adventure-nav"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 17px",
                  borderRadius: 12,
                  background:
                    "linear-gradient(120deg, #ead59b 80%, #c3ac69 100%)",
                  color: "#7c6737",
                  border: "2.2px solid #ad9c62",
                  fontSize: 17,
                  fontFamily: "'Pirata One', cursive",
                  boxShadow: "0 2px 5px #b7a7513b",
                  transition: "all 0.15s",
                  marginRight: 2,
                  cursor: "pointer",
                }}
              >
                <Icon className="h-6 w-6" style={{ color: "#8a7e56" }} />
                <span>{name}</span>
              </button>
            </Link>
          ))}
          {user && (
            <button
              onClick={logout}
              className="btn-adventure-nav"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 17px",
                borderRadius: 12,
                background:
                  "linear-gradient(120deg, #ffdad2 60%, #cfaea2 100%)",
                color: "#7c6737",
                border: "2.2px solid #ad9c62",
                fontSize: 17,
                fontFamily: "'Pirata One', cursive",
                boxShadow: "0 2px 5px #b7a7513b",
                transition: "all 0.15s",
                cursor: "pointer",
              }}
            >
              <PowerIcon className="h-6 w-6" style={{ color: "#b2503a" }} />
              <span>Salir</span>
            </button>
          )}
        </div>
      </div>
      {/* Menú móvil */}
      {menuOpen && (
        <ul
          className="adventure-nav-mobile"
          style={{
            background: "linear-gradient(90deg, #e1c894 0%, #b6a077 100%)",
            boxShadow: "0 3px 12px #b7a75190",
            borderRadius: "0 0 20px 20px",
            margin: "0 -6px",
            padding: "22px 12px 16px 12px",
            position: "absolute",
            left: 0,
            top: 62,
            width: "100%",
            zIndex: 40,
            listStyle: "none",
            display: "block",
            animation: "stonePop 0.2s",
          }}
        >
          {navItems.map(({ name, path, Icon }) => (
            <li key={name}>
              <Link to={path} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                <button
                  className="btn-adventure-nav"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    width: "100%",
                    padding: "12px 10px",
                    borderRadius: 13,
                    marginBottom: 7,
                    background: "linear-gradient(120deg, #f2e2af 80%, #b9a97e 100%)",
                    color: "#7c6737",
                    border: "2px solid #ad9c62",
                    fontSize: 18,
                    fontFamily: "'Pirata One', cursive",
                    boxShadow: "0 2px 7px #b7a7511b",
                    cursor: "pointer",
                    transition: "all 0.13s",
                  }}
                >
                  <Icon className="h-7 w-7" style={{ color: "#8a7e56" }} />
                  <span>{name}</span>
                </button>
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="btn-adventure-nav"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  width: "100%",
                  padding: "12px 10px",
                  borderRadius: 13,
                  marginBottom: 7,
                  background: "linear-gradient(120deg, #ffdad2 80%, #d2a37b 100%)",
                  color: "#b2503a",
                  border: "2px solid #b2503a",
                  fontSize: 18,
                  fontFamily: "'Pirata One', cursive",
                  boxShadow: "0 2px 7px #b7a7511b",
                  cursor: "pointer",
                }}
              >
                <PowerIcon className="h-7 w-7" style={{ color: "#b2503a" }} />
                <span>Salir</span>
              </button>
            </li>
          )}
        </ul>
      )}
      <style>{`
        @media (min-width: 1241px) {
          .adventure-nav-desktop { display: flex !important; }
          .sm\\:hidden { display: none !important; }
        }
        @media (max-width: 1240px) {
          .adventure-nav-desktop { display: none !important; }
          .sm\\:hidden { display: block !important; }
        }
        @keyframes stonePop {
          0% { transform: scale(0.98); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .btn-adventure-nav:active {
          background: #e1c894 !important;
          color: #b2503a !important;
          box-shadow: 0 0 2px #6b5835;
        }
        .btn-adventure-nav:hover {
          background: #ffecc5 !important;
          color: #a2782d !important;
          transform: scale(1.07);
        }
      `}</style>
    </nav>
  );
}
