// src/components/HorizontalNavBar.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { NAV_CONFIG } from '../constants/navConfig'
import { Bars3Icon, PowerIcon } from '@heroicons/react/24/outline'

export default function HorizontalNavBar() {
  const { user, logout } = useAuth()
  const userRoles = user?.role || []

  // Filtra ítems según roles: sólo se muestran los que cumplen
  const navItems = NAV_CONFIG.filter(item =>
    item.roles.some(role => userRoles.includes(role))
  )

  // Estado para controlar el menú móvil (hamburger)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className=" p-4 rounded-2xl shadow-lg w-full">
      <div className="flex items-center justify-between gap-x-16">
        {/* Logo o título de la app */}
        <div className="text-lg font-bold text-gray-800">
          MiKhipu
        </div>

        {/* Botón del menú para móviles */}
        <div className="sm:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 rounded hover:bg-gray-100 cursor-pointer"
            aria-label="Abrir menú"
          >
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Menú horizontal (visible en pantallas sm y superiores) */}
        <ul className="hidden sm:flex items-center space-x-6">
          {navItems.map(({ name, path, Icon }) => (
            <li key={name}>
              <Link to={path}>
                <button
                  className="group flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 hover:scale-105 transition-transform transition-colors cursor-pointer"
                >
                  <Icon className="h-6 w-6 text-gray-700 group-hover:text-sky-500 transition-colors" />
                  <span className="text-gray-700 group-hover:text-sky-500 transition-colors">
                    {name}
                  </span>
                </button>
              </Link>
            </li>
          ))}
          {/* Botón de Logout */}
          {user && (
            <li>
              <button
                onClick={logout}
                className="group flex items-center space-x-2 p-2 rounded-lg hover:bg-red-200 hover:scale-105 transition-transform transition-colors cursor-pointer"
              >
                <PowerIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  Salir
                </span>
              </button>
            </li>
          )}
        </ul>
      </div>
      {/* Menú móvil desplegable */}
      {menuOpen && (
        <ul className="sm:hidden mt-4 space-y-4">
          {navItems.map(({ name, path, Icon }) => (
            <li key={name}>
              <Link to={path} onClick={() => setMenuOpen(false)}>
                <button className="w-full cursor-pointer group flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 hover:scale-105 transition-transform transition-colors">
                  <Icon className="h-6 w-6 text-gray-700 group-hover:text-sky-500 transition-colors" />
                  <span className="text-gray-700 group-hover:text-sky-500 transition-colors">{name}</span>
                </button>
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full cursor-pointer group flex items-center space-x-2 p-2 rounded-lg hover:bg-red-200 hover:scale-105 transition-transform transition-colors"
              >
                <PowerIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Salir</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
