import { useState } from 'react';

export default function StudentSelectByName({ students, value, onChange }) {
  const [search, setSearch] = useState('');

  // Filtra estudiantes por el texto buscado (case-insensitive)
  const filtered = students.filter(stu =>
    stu.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <label className="block text-xs">Estudiante</label>
      <input
        type="text"
        placeholder="Buscar estudiante..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="rounded-lg border p-2 mb-1 w-full"
      />
      <select
        value={value}
        onChange={onChange}
        className="rounded-lg border p-2 w-full"
      >
        <option value="">Todos</option>
        {filtered.map(stu => (
          <option key={stu.id} value={stu.id}>{stu.fullName}</option>
        ))}
      </select>
    </div>
  );
}
