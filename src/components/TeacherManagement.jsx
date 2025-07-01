// src/pages/TeacherManagement.jsx
import { useEffect, useState } from "react";
import { getTeachers, deleteTeacher } from "../api/teachers";
import DeleteButton from "./UI/DeleteButton";
import AddPersonButton from "./UI/AddPersonButton";
import TeacherModal from "./modals/TeacherModal";
import EditButton from "./UI/EditButton";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchTeachers = async () => {
    setLoading(true);
    setGlobalError("");
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      setGlobalError(err.message);
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    setGlobalError("");
    try {
      await deleteTeacher(deleteId);
      setActionMessage("Persona eliminada con éxito.");
      setTimeout(() => setActionMessage(""), 2000);
      setShowDeleteModal(false);
      await fetchTeachers();
    } catch (err) {
      setGlobalError(err.message);
    }
    setActionLoading(false);
  };

  // --- Modal de Eliminación ---
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="adventure-container">
      <h1 className="adventure-title">Administración de Docentes</h1>
      {globalError && <div className="note-adventure mb-4">{globalError}</div>}

      <div className="adventure-header-row">
        <TeacherModal trigger={<AddPersonButton />} />
      </div>

      {loading ? (
        <div className="note-adventure text-center py-10">Cargando docentes...</div>
      ) : (
        <div className="panel-adventure" style={{ overflowX: 'auto' }}>
          <table className="table-adventure">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Código</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.person.firstName} {teacher.person.lastName}</td>
                  <td>{teacher.person?.dni || "-"}</td>
                  <td>{teacher.person?.user?.email || "-"}</td>
                  <td>{teacher.code || "-"}</td>
                  <td>
                    <TeacherModal trigger={<EditButton className="btn-adventure-icon" />} teacherId={teacher.id} />
                    <button
                      className="btn-adventure-secondary"
                      style={{ marginLeft: 4 }}
                      onClick={() => openDeleteModal(teacher.id)}
                    >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="modal-adventure-backdrop">
          <div className="modal-adventure">
            <h2 className="adventure-title" style={{ fontSize: 20 }}>Confirmar Eliminación</h2>
            <p className="mb-4">¿Estás seguro de eliminar esta persona?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-adventure-secondary"
                style={{ minWidth: 92 }}
              >
                Cerrar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="btn-adventure"
                style={{ minWidth: 110, background: "#c0392b", borderColor: "#84261c" }}
              >
                {actionLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos Adventure */}
      <style>{`
      .adventure-container {
        max-width: 920px;
        margin: 0 auto;
        padding: 32px 16px 50px 16px;
        background: #fffbe6;
        border-radius: 32px;
        box-shadow: 0 8px 30px #efd89844;
      }
      .adventure-title {
        font-family: 'Pirata One', 'Press Start 2P', cursive, monospace;
        color: #95702a;
        font-size: 2.2rem;
        margin-bottom: 16px;
        text-align: center;
        letter-spacing: 0.5px;
      }
      .adventure-header-row {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
      }
      .panel-adventure {
        background: linear-gradient(110deg, #f8e9b4 80%, #f7f3e1 100%);
        border: 3px solid #b99c4c;
        border-radius: 22px;
        box-shadow: 0 0 12px #cab06e55;
        padding: 0;
      }
      .table-adventure {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: #f0e1ac;
        font-family: inherit;
      }
      .table-adventure th, .table-adventure td {
        border-bottom: 1.5px dashed #cfb56c;
        padding: 12px 13px;
        text-align: center;
        font-size: 15px;
      }
      .table-adventure th {
        background: #fff7db;
        color: #8c712b;
        font-size: 16px;
        font-weight: 700;
        border-bottom: 2.7px solid #d1b35c;
        letter-spacing: 0.2px;
      }
      .table-adventure tr:last-child td {
        border-bottom: none;
      }
      .note-adventure {
        background: #fef6e2;
        color: #876f24;
        border-left: 5px solid #c6aa64;
        border-radius: 11px;
        padding: 11px 22px;
        font-family: inherit;
        font-size: 15px;
        margin-bottom: 12px;
      }
      .btn-adventure, .btn-adventure-secondary, .btn-adventure-icon {
        font-family: inherit;
        font-weight: 700;
        border-radius: 9px;
        padding: 7px 19px;
        font-size: 15px;
        border: 2.2px solid #95702a;
        margin-top: 0;
        transition: all .15s;
        cursor: pointer;
      }
      .btn-adventure {
        background: #ffe08b;
        color: #6e540b;
        border-color: #95702a;
        box-shadow: 1px 2px #e8dfb5;
      }
      .btn-adventure:hover {
        background: #fff4ca;
        color: #3a2900;
        border-color: #bfa157;
        box-shadow: 1px 3px 8px #ffe4a622;
      }
      .btn-adventure-secondary {
        background: #f7efc4;
        color: #8b7417;
        border-color: #b9a142;
      }
      .btn-adventure-secondary:hover {
        background: #e4d481;
        border-color: #95702a;
        color: #634d11;
      }
      .btn-adventure-icon {
        background: #f7efc4;
        color: #8b7417;
        border-color: #b9a142;
        padding: 7px 14px;
        font-size: 17px;
      }
      .btn-adventure-icon:hover {
        background: #e4d481;
        color: #634d11;
        border-color: #95702a;
      }
      /* Modal styles */
      .modal-adventure-backdrop {
        position: fixed; left:0; top:0; right:0; bottom:0;
        background: rgba(40, 30, 2, 0.34);
        z-index: 50;
        display: flex; align-items: center; justify-content: center;
      }
      .modal-adventure {
        background: #fffbe6;
        border: 4px solid #b99c4c;
        border-radius: 20px;
        box-shadow: 0 4px 40px #cab06e55;
        padding: 32px 18px 22px 18px;
        max-width: 340px;
        width: 95vw;
        text-align: center;
      }
      .mb-4 { margin-bottom: 16px; }
      .mt-4 { margin-top: 16px; }
      .flex { display: flex; }
      .justify-center { justify-content: center; }
      .space-x-4 > * + * { margin-left: 1rem; }
      .disabled { opacity: 0.5; cursor: not-allowed; }
    `}</style>
    </div>
  );

}
