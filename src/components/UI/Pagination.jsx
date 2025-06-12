import React from 'react';

function getPages(current, total) {
  // Muestra como máximo 5 páginas: [1] ... [3] [4] [5] ... [10]
  const pages = [];
  if (total <= 5) {
    for (let i = 0; i < total; i++) pages.push(i);
    return pages;
  }
  if (current <= 2) return [0, 1, 2, 3, -1, total - 1];
  if (current >= total - 3) return [0, -1, total - 4, total - 3, total - 2, total - 1];
  return [0, -1, current - 1, current, current + 1, -1, total - 1];
}

export default function Pagination({
  page = 0,
  totalPages = 1,
  onChangePage = () => {},
  className = '',
  size, // número de items por página (opcional)
  onChangeSize, // función a llamar cuando cambie el tamaño de página (opcional)
  sizeOptions = [10, 20, 50, 100], // opciones de tamaño de página (opcional)
}) {
  const pages = getPages(page, totalPages);

  return (
    <div className={`flex justify-end items-center gap-2 mt-4 select-none ${className}`}>
      <button
        onClick={() => onChangePage(0)}
        disabled={page === 0}
        className="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 transition"
        title="Primera página"
      >
        ⏮
      </button>
      <button
        onClick={() => onChangePage(page - 1)}
        disabled={page === 0}
        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 transition"
        title="Anterior"
      >
        &lt;
      </button>
      <div className="flex gap-1 mx-2">
        {pages.map((p, i) =>
          p === -1 ? (
            <span key={i} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChangePage(p)}
              className={`px-3 py-1 rounded-lg border ${p === page
                ? 'bg-blue-600 text-white font-semibold border-blue-600'
                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-100'
              } transition`}
              disabled={p === page}
            >
              {p + 1}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onChangePage(page + 1)}
        disabled={page >= totalPages - 1}
        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 transition"
        title="Siguiente"
      >
        &gt;
      </button>
      <button
        onClick={() => onChangePage(totalPages - 1)}
        disabled={page >= totalPages - 1}
        className="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 transition"
        title="Última página"
      >
        ⏭
      </button>
      <span className="ml-2 text-sm text-gray-500">
        Página <span className="font-semibold">{page + 1}</span> de {totalPages}
      </span>
      {/* Nuevo: Selector de tamaño de página */}
      {typeof size !== 'undefined' && typeof onChangeSize === 'function' && (
        <div className="ml-4 flex items-center gap-1">
          <label htmlFor="size-select" className="text-sm text-gray-500">Tamaño:</label>
          <select
            id="size-select"
            className="px-2 py-1 rounded-lg border border-gray-300 text-sm"
            value={size}
            onChange={e => onChangeSize(Number(e.target.value))}
          >
            {sizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
