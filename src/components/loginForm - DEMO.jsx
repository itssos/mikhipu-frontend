import { useState } from 'react';
import { login } from '../api/auth';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const data = await login(username, password);
      console.log('Login exitoso:', data);
      // Aquí rediriges según el rol o guardas el token
    } catch (error) {
      setErrorMsg(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Iniciar Sesión</h2>
      {errorMsg && <p className="text-red-500 text-sm mb-3">{errorMsg}</p>}
      <div className="mb-4">
        <label className="block mb-1">Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
}
