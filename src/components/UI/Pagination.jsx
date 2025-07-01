import React from 'react';

function getPages(current, total) {
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
  size,
  onChangeSize,
  sizeOptions = [10, 20, 50, 100],
}) {
  const pages = getPages(page, totalPages);

  return (
    <div
      className={`adventure-pagination ${className}`}
      style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        gap: 12,
        marginTop: 22,
        fontFamily: "'Pirata One', cursive",
        fontSize: 17,
        userSelect: "none",
      }}
    >
      <button
        onClick={() => onChangePage(0)}
        disabled={page === 0}
        className="btn-adventure-icon"
        title="Primera página"
        style={{ minWidth: 36 }}
      >
        ⏮
      </button>
      <button
        onClick={() => onChangePage(page - 1)}
        disabled={page === 0}
        className="btn-adventure-icon"
        title="Anterior"
        style={{ minWidth: 36 }}
      >
        &lt;
      </button>
      <div style={{ display: "flex", gap: 3, margin: "0 7px" }}>
        {pages.map((p, i) =>
          p === -1 ? (
            <span key={i} className="note-adventure" style={{ padding: "0 5px" }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChangePage(p)}
              className={`btn-adventure-pagination${p === page ? " active" : ""}`}
              disabled={p === page}
              style={{
                minWidth: 37,
                padding: "7px 0",
                fontWeight: p === page ? 700 : 400,
                cursor: p === page ? "default" : "pointer",
                opacity: p === page ? 1 : 0.93
              }}
            >
              {p + 1}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onChangePage(page + 1)}
        disabled={page >= totalPages - 1}
        className="btn-adventure-icon"
        title="Siguiente"
        style={{ minWidth: 36 }}
      >
        &gt;
      </button>
      <button
        onClick={() => onChangePage(totalPages - 1)}
        disabled={page >= totalPages - 1}
        className="btn-adventure-icon"
        title="Última página"
        style={{ minWidth: 36 }}
      >
        ⏭
      </button>
      <span style={{
        marginLeft: 16,
        fontSize: 15,
        color: "#ad9c62",
        letterSpacing: 1
      }}>
        Página <b style={{ color: "#8a7e56" }}>{page + 1}</b> de {totalPages}
      </span>
      {typeof size !== 'undefined' && typeof onChangeSize === 'function' && (
        <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 3 }}>
          <label htmlFor="size-select" style={{ fontSize: 15, color: "#b7a751" }}>Tamaño:</label>
          <select
            id="size-select"
            className="select-adventure"
            value={size}
            onChange={e => onChangeSize(Number(e.target.value))}
            style={{ fontSize: 15, minWidth: 60, marginLeft: 5 }}
          >
            {sizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
      <style>{`
        .btn-adventure-pagination {
          background: linear-gradient(120deg, #ead59b 80%, #c3ac69 100%);
          color: #7c6737;
          border: 2.2px solid #ad9c62;
          border-radius: 8px 15px 8px 13px;
          font-family: 'Pirata One', cursive;
          box-shadow: 0 2px 5px #b7a7513b;
          margin-right: 1px;
          transition: 
            background 0.13s, color 0.13s, border 0.13s, box-shadow 0.18s;
        }
        .btn-adventure-pagination.active {
          background: linear-gradient(120deg, #e1c894 88%, #fff8c4 100%);
          color: #d4a33a;
          border-color: #d4a33a;
          box-shadow: 0 2px 11px #b9a75144;
          font-weight: bold;
          cursor: default;
          opacity: 1 !important;
        }
        .btn-adventure-pagination:not(.active):hover {
          background: #f2e2af;
          color: #ad9c62;
        }
        .btn-adventure-icon {
          background: linear-gradient(120deg, #bdb575 60%, #6a5f2b 100%);
          color: #2e220b;
          border: 2.2px solid #5b4d18;
          border-radius: 12px 14px 12px 16px;
          font-size: 18px;
          font-family: 'Pirata One', cursive;
          box-shadow: 1px 2px 4px #b7a7512a;
          transition: background 0.12s, color 0.1s;
        }
        .btn-adventure-icon:disabled,
        .btn-adventure-pagination:disabled {
          opacity: 0.58;
          cursor: not-allowed;
          filter: grayscale(0.16);
        }
        .btn-adventure-icon:not(:disabled):hover {
          background: #d8c175;
          color: #a58e41;
        }
        .select-adventure {
          background: #fff8c4;
          border: 2.2px solid #b7a751;
          border-radius: 9px 14px 8px 12px;
          padding: 5px 7px;
          font-family: 'Pirata One', cursive;
          color: #56421d;
          outline: none;
          box-shadow: 1.5px 3px #afa36b;
        }
        .note-adventure {
          color: #ad9c62;
          font-size: 16px;
          font-family: 'Pirata One', cursive;
        }
      `}</style>
    </div>
  );
}
