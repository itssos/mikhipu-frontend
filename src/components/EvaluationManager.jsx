import { useEffect, useState } from 'react';
import {
  filterEvaluations,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationById,
} from '../api/evaluation';
import { getCourses } from '../api/courses';
import { getTeachers } from '../api/teachers';
import Modal from './UI/Modal';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCan from '../hooks/useCan'
import Pagination from './UI/Pagination';

const EVALUATION_TYPES = [
  "EXAM", "PROJECT", "QUIZ", "ASSIGNMENT", "PRESENTATION", "OTHER"
];

const QUARTERS = [
  { value: "PRIMER", label: "1er Trimestre" },
  { value: "SEGUNDO", label: "2do Trimestre" },
  { value: "TERCER", label: "3er Trimestre" },
  { value: "VERANO", label: "Verano" },
];

function emptyForm() {
  return {
    courseId: "",
    name: "",
    type: "",
    weight: "",
    date: "",
    minScore: "",
    maxScore: "",
  };
}

export default function EvaluationManager() {
  // STATE
  const [evaluations, setEvaluations] = useState({});
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState({
    courseId: "",
    teacherId: "",
    year: "",
    quarter: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const canCreate = useCan('CREATE_EVALUATION');
  const canUpdate = useCan('UPDATE_EVALUATION');
  const canDelete = useCan('DELETE_EVALUATION');

  // Para el formulario, y saber si se está creando o editando
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Para que sólo un modal de eliminar esté abierto a la vez
  const [deleteModalOpenId, setDeleteModalOpenId] = useState(null);

  // Para que sólo un modal de editar esté abierto a la vez
  const [editModalOpenId, setEditModalOpenId] = useState(null);

  // FETCH
  useEffect(() => {
    getCourses().then(r => setCourses(r?.data || r || []));
    getTeachers().then(r => setTeachers(r?.data || r || []));
    fetchEvaluations();
    // eslint-disable-next-line
  }, []);

  function fetchEvaluations(p = 0, f = filter) {
    setLoading(true);
    filterEvaluations(
      {
        ...f,
        courseId: f.courseId ? Number(f.courseId) : undefined,
        teacherId: f.teacherId ? Number(f.teacherId) : undefined,
        year: f.year || undefined,
        quarter: f.quarter || undefined,
        type: f.type || undefined,
        startDate: f.startDate || undefined,
        endDate: f.endDate || undefined,
      },
      p, 20, "date,desc"
    )
      .then((res) => {
        setEvaluations(res);
      })
      .finally(() => setLoading(false));
  }

  // FORM HANDLERS
  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleFilterChange(e) {
    setFilter(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // CREAR
  function handleCreateFormSubmit(e, closeModal) {
    if (e) e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      courseId: Number(form.courseId),
      weight: Number(form.weight),
      minScore: Number(form.minScore),
      maxScore: Number(form.maxScore),
    };
    createEvaluation(payload)
      .then(() => {
        fetchEvaluations();
        toast.success("Evaluación creada");
        setForm(emptyForm());
        if (closeModal) closeModal();
      })
      .catch(() => toast.error("Error al guardar la evaluación"))
      .finally(() => setLoading(false));
  }

  // EDITAR
  function handleEditFormSubmit(e, closeModal, id) {
    if (e) e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      courseId: Number(form.courseId),
      weight: Number(form.weight),
      minScore: Number(form.minScore),
      maxScore: Number(form.maxScore),
    };
    updateEvaluation(id, payload)
      .then(() => {
        fetchEvaluations();
        toast.success("Evaluación actualizada");
        setForm(emptyForm());
        setEditingId(null);
        setEditModalOpenId(null);
        if (closeModal) closeModal();
      })
      .catch(() => toast.error("Error al guardar la evaluación"))
      .finally(() => setLoading(false));
  }

  // ELIMINAR
  function handleDelete(id, closeModal) {
    setLoading(true);
    deleteEvaluation(id)
      .then(() => {
        fetchEvaluations();
        toast.success("Evaluación eliminada");
        setDeleteModalOpenId(null);
        if (closeModal) closeModal();
      })
      .catch(() => toast.error("Error al eliminar evaluación"))
      .finally(() => setLoading(false));
  }

  // MODAL FORMULARIO
  function renderForm(isEdit = false, closeModal, evaId) {
    return (
      <form className="adventure-form space-y-3"
        onSubmit={isEdit
          ? e => handleEditFormSubmit(e, closeModal, evaId)
          : e => handleCreateFormSubmit(e, closeModal)
        }
      >
        <style>{`
    .adventure-form {
      background: linear-gradient(120deg, #efe1b5 70%, #cfc08a 100%);
      border: 4px solid #95702a;
      border-radius: 26px;
      box-shadow: 0 0 24px #cab06e55;
      padding: 30px 24px 20px 24px;
      font-family: 'Pirata One', 'Press Start 2P', cursive, monospace;
      max-width: 480px;
      margin: 0 auto;
    }
    .adventure-form label {
      font-family: 'Pirata One', cursive;
      color: #7d6827;
      font-size: 15px;
      margin-bottom: 2px;
      font-weight: 700;
      letter-spacing: .5px;
    }
    .adventure-form input,
    .adventure-form select {
      background: #f7f4e3;
      border: 2.4px solid #bca974;
      border-radius: 13px;
      padding: 10px 13px;
      font-family: inherit;
      font-size: 15px;
      color: #715f3a;
      outline: none;
      box-shadow: 1px 2px #e8dfb5;
      transition: border 0.17s, box-shadow 0.15s, background 0.17s;
      margin-top: 2px;
    }
    .adventure-form input:focus,
    .adventure-form select:focus {
      border-color: #8a7e56;
      background: #fffde2;
      box-shadow: 0 2px 12px #cab06e44;
    }
    .adventure-form textarea {
      background: #f7f4e3;
      border: 2.4px solid #bca974;
      border-radius: 13px;
      padding: 10px 13px;
      font-family: inherit;
      font-size: 15px;
      color: #715f3a;
      resize: vertical;
      min-height: 70px;
      margin-top: 2px;
      outline: none;
      transition: border 0.17s, box-shadow 0.15s, background 0.17s;
      box-shadow: 1px 2px #e8dfb5;
    }
    .adventure-form textarea:focus {
      border-color: #8a7e56;
      background: #fffde2;
      box-shadow: 0 2px 12px #cab06e44;
    }
    .adventure-form .flex {
      gap: 16px;
    }
  `}</style>

        <div>
          <label>Curso <span className="text-red-500">*</span></label>
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleFormChange}
            required
          >
            <option value="">Selecciona...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Nombre <span className="text-red-500">*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            required
            maxLength={50}
          />
        </div>
        <div>
          <label>Tipo <span className="text-red-500">*</span></label>
          <select
            name="type"
            value={form.type}
            onChange={handleFormChange}
            required
          >
            <option value="">Selecciona...</option>
            {EVALUATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Peso (%) <span className="text-red-500">*</span></label>
          <input
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleFormChange}
            required min={1} max={100}
          />
        </div>
        <div>
          <label>Fecha <span className="text-red-500">*</span></label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1" >
            <label>Nota mínima <span className="text-red-500">*</span></label>
            <input
              name="minScore"
              type="number"
              value={form.minScore}
              onChange={handleFormChange}
              style={{maxWidth:'70px'}}
              required
            />
          </div>
          <div className="flex-1" >
            <label>Nota máxima <span className="text-red-500">*</span></label>
            <input
              name="maxScore"
              type="number"
              value={form.maxScore}
              onChange={handleFormChange}
              style={{maxWidth:'70px'}}
              required
            />
          </div>
        </div>
      </form>

    );
  }

  // RENDER
  return (
    <div className="panel-adventure" style={{ maxWidth: 1080, margin: "40px auto 0 auto" }}>
      <ToastContainer position="top-right" autoClose={1800} hideProgressBar />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h2 className="adventure-title w-full">Gestión de Evaluaciones</h2>
        {canCreate && (
          <Modal
            title="Nueva Evaluación"
            bg='bg-transparent'
            shadow={false}
            trigger={
              <button
                className="btn-adventure"
                onClick={() => {
                  setForm(emptyForm());
                  setEditingId(null);
                }}
              >
                <PlusIcon style={{ width: 22, height: 22, marginRight: 7, verticalAlign: -4 }} /> Nueva evaluación
              </button>
            }
            size="md"
            actions={[
              {
                label: "Guardar",
                onClick: (e, closeModal) => handleCreateFormSubmit(e, closeModal),
                closeOnClick: false,
                className: "btn-adventure"
              },
              { label: "Cancelar", className: "btn-adventure-secondary" }
            ]}
          >
            {renderForm(false)}
          </Modal>
        )}
      </div>

      {/* FILTROS */}
      <form
        className="panel-adventure"
        style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 17, marginBottom: 32, background: "#fffbe5", minHeight: 0 }}
        onSubmit={e => { e.preventDefault(); fetchEvaluations(0, filter); }}
      >
        <div>
          <label style={{ fontSize: 13, color: "#b7a751", marginBottom: 4, display: "block" }}>Curso</label>
          <select
            name="courseId"
            value={filter.courseId}
            onChange={handleFilterChange}
            className="select-adventure"
          >
            <option value="">Todos</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#b7a751", marginBottom: 4, display: "block" }}>Docente</label>
          <select
            name="teacherId"
            value={filter.teacherId}
            onChange={handleFilterChange}
            className="select-adventure"
          >
            <option value="">Todos</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.person.firstName} {t.person.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#b7a751", marginBottom: 4, display: "block" }}>Año</label>
          <input
            name="year"
            type="number"
            value={filter.year}
            onChange={handleFilterChange}
            className="input-adventure"
            min="2000"
          />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#b7a751", marginBottom: 4, display: "block" }}>Trimestre</label>
          <select
            name="quarter"
            value={filter.quarter}
            onChange={handleFilterChange}
            className="select-adventure"
          >
            <option value="">Todos</option>
            {QUARTERS.map(q => (
              <option key={q.value} value={q.value}>{q.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#b7a751", marginBottom: 4, display: "block" }}>Tipo</label>
          <select
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
            className="select-adventure"
          >
            <option value="">Todos</option>
            {EVALUATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#b7a751", marginBottom: 4, display: "block" }}>Desde</label>
          <input
            name="startDate"
            type="date"
            value={filter.startDate}
            onChange={handleFilterChange}
            className="input-adventure"
          />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#b7a751", marginBottom: 4, display: "block" }}>Hasta</label>
          <input
            name="endDate"
            type="date"
            value={filter.endDate}
            onChange={handleFilterChange}
            className="input-adventure"
          />
        </div>
        <button
          type="submit"
          className="btn-adventure"
          style={{ minWidth: 100, marginLeft: 10 }}
        >
          <MagnifyingGlassIcon style={{ width: 19, height: 19, marginRight: 4, verticalAlign: -4 }} /> Buscar
        </button>
      </form>

      {/* TABLA */}
      <div style={{ overflowX: "auto", borderRadius: 16 }}>
        <table className="table-adventure" style={{ minWidth: 750 }}>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Peso (%)</th>
              <th>Mín.</th>
              <th>Máx.</th>
              {(canUpdate || canDelete) && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {evaluations?.content?.length === 0 && !loading && (
              <tr>
                <td colSpan={8}>
                  <div className="note-adventure text-center" style={{ margin: 0 }}>
                    No hay evaluaciones encontradas.
                  </div>
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={8}>
                  <div className="note-adventure text-center" style={{ color: "#9679a2" }}>
                    Cargando...
                  </div>
                </td>
              </tr>
            )}
            {evaluations?.content?.map(eva => (
              <tr key={eva.id}>
                <td>{eva.courseName}</td>
                <td>{eva.name}</td>
                <td>{eva.type}</td>
                <td>{eva.date}</td>
                <td>{eva.weight}</td>
                <td>{eva.minScore}</td>
                <td>{eva.maxScore}</td>
                {(canUpdate || canDelete) && (
                  <td>
                    {/* Modal Editar */}
                    {canUpdate && (
                      <Modal
                        title="Editar Evaluación"
                        trigger={
                          <button
                            className="btn-adventure-icon"
                            title="Editar"
                            onClick={async () => {
                              setEditingId(eva.id);
                              const res = await getEvaluationById(eva.id);
                              const data = res.data || res;
                              setForm({
                                ...data,
                                courseId: data.course?.id ?? "",
                                date: data.date?.substring(0, 10)
                              });
                              setEditModalOpenId(eva.id);
                            }}
                          >
                            <PencilSquareIcon style={{ width: 19, height: 19 }} />
                          </button>
                        }
                        size="md"
                        actions={[
                          {
                            label: "Guardar",
                            onClick: (e, closeModal) => handleEditFormSubmit(e, closeModal, eva.id),
                            closeOnClick: false,
                            className: "btn-adventure"
                          },
                          { label: "Cancelar", className: "btn-adventure-secondary" }
                        ]}
                      >
                        {editingId === eva.id && renderForm(true)}
                      </Modal>
                    )}
                    {/* Modal Eliminar */}
                    {canDelete && (
                      <Modal
                        title="¿Eliminar evaluación?"
                        trigger={
                          <button
                            className="btn-adventure-icon"
                            title="Eliminar"
                            onClick={() => setDeleteModalOpenId(eva.id)}
                          >
                            <TrashIcon style={{ width: 19, height: 19 }} />
                          </button>
                        }
                        size="sm"
                        actions={[
                          {
                            label: "Sí, eliminar",
                            onClick: (e, closeModal) => handleDelete(eva.id, closeModal),
                            className: "btn-adventure-secondary"
                          },
                          { label: "Cancelar", className: "btn-adventure" }
                        ]}
                      >
                        <div style={{ textAlign: "center", padding: 18 }}>
                          ¿Seguro que deseas eliminar esta evaluación? <br />
                          <span style={{ color: "#b53" }}>Esta acción no se puede deshacer.</span>
                        </div>
                      </Modal>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        page={evaluations.number}
        totalPages={evaluations.totalPages}
        onChangePage={fetchEvaluations}
      />
    </div>
  );

}