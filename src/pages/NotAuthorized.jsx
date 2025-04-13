
import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => (
  <div>
    <h1>No Autorizado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
    <Link to="/dashboard">Volver al Dashboard</Link>
  </div>
);

export default NotAuthorized;
