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
      <form className="space-y-3" onSubmit={isEdit
        ? e => handleEditFormSubmit(e, closeModal, evaId)
        : e => handleCreateFormSubmit(e, closeModal)
      }>
        <div>
          <label className="block text-xs mb-1">Curso <span className="text-red-500">*</span></label>
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleFormChange}
            className="w-full rounded-xl shadow px-2 test-course-evaluation-create py-1 border border-gray-200"
            required
          >
            <option value="">Selecciona...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Nombre <span className="text-red-500">*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            className="w-full rounded-xl shadow px-2 py-1 border border-gray-200"
            required
            maxLength={50}
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Tipo <span className="text-red-500">*</span></label>
          <select
            name="type"
            value={form.type}
            onChange={handleFormChange}
            className="w-full rounded-xl shadow px-2 test-type-evaluation-create py-1 border border-gray-200"
            required
          >
            <option value="">Selecciona...</option>
            {EVALUATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Peso (%) <span className="text-red-500">*</span></label>
          <input
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleFormChange}
            className="w-full rounded-xl shadow px-2 py-1 border border-gray-200"
            required min={1} max={100}
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Fecha <span className="text-red-500">*</span></label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleFormChange}
            className="w-full rounded-xl shadow px-2 py-1 border border-gray-200"
            required
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs mb-1">Nota mínima <span className="text-red-500">*</span></label>
            <input
              name="minScore"
              type="number"
              value={form.minScore}
              onChange={handleFormChange}
              className="w-full rounded-xl shadow px-2 py-1 border border-gray-200"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1">Nota máxima <span className="text-red-500">*</span></label>
            <input
              name="maxScore"
              type="number"
              value={form.maxScore}
              onChange={handleFormChange}
              className="w-full rounded-xl shadow px-2 py-1 border border-gray-200"
              required
            />
          </div>
        </div>
      </form>
    );
  }

  // RENDER
  return (
    <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 via-white to-purple-100 max-w-5xl mx-auto mt-8">
      <ToastContainer position="top-right" autoClose={1800} hideProgressBar />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Evaluaciones</h2>
        {/* Modal crear */}
        {canCreate && (
          <Modal
            title="Nueva Evaluación"
            trigger={
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-2xl shadow-lg transition-all"
                onClick={() => {
                  setForm(emptyForm());
                  setEditingId(null);
                }}
              >
                <PlusIcon className="h-5 w-5" /> Nueva evaluación
              </button>
            }
            size="md"
            actions={[
              {
                label: "Guardar",
                onClick: (e, closeModal) => handleCreateFormSubmit(e, closeModal),
                closeOnClick: false,
                className: "bg-blue-600 text-white"
              },
              { label: "Cancelar", className: "bg-gray-300" }
            ]}
          >
            {renderForm(false)}
          </Modal>
        )}

      </div>

      {/* FILTROS */}
      <form
        className="flex flex-wrap items-end gap-3 mb-6 bg-white/80 rounded-xl shadow px-4 py-3"
        onSubmit={e => { e.preventDefault(); fetchEvaluations(0, filter); }}
      >
        <div>
          <label className="block text-xs text-gray-500 mb-1">Curso</label>
          <select
            name="courseId"
            value={filter.courseId}
            onChange={handleFilterChange}
            className="rounded-xl shadow px-2 py-1 border border-gray-200"
          >
            <option value="">Todos</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Docente</label>
          <select
            name="teacherId"
            value={filter.teacherId}
            onChange={handleFilterChange}
            className="rounded-xl shadow px-2 py-1 border border-gray-200"
          >
            <option value="">Todos</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.person.firstName} {t.person.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Año</label>
          <input
            name="year"
            type="number"
            value={filter.year}
            onChange={handleFilterChange}
            className="rounded-xl shadow px-2 py-1 border border-gray-200 w-24"
            min="2000"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Trimestre</label>
          <select
            name="quarter"
            value={filter.quarter}
            onChange={handleFilterChange}
            className="rounded-xl shadow px-2 py-1 border border-gray-200"
          >
            <option value="">Todos</option>
            {QUARTERS.map(q => (
              <option key={q.value} value={q.value}>{q.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tipo</label>
          <select
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
            className="rounded-xl shadow px-2 py-1 border border-gray-200"
          >
            <option value="">Todos</option>
            {EVALUATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Desde</label>
          <input
            name="startDate"
            type="date"
            value={filter.startDate}
            onChange={handleFilterChange}
            className="rounded-xl shadow px-2 py-1 border border-gray-200"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <input
            name="endDate"
            type="date"
            value={filter.endDate}
            onChange={handleFilterChange}
            className="rounded-xl shadow px-2 py-1 border border-gray-200"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1 bg-gray-900 hover:bg-gray-700 text-white px-4 py-1.5 rounded-2xl shadow-md"
        >
          <MagnifyingGlassIcon className="h-5 w-5" /> Buscar
        </button>
      </form>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white rounded-xl text-sm shadow">
          <thead>
            <tr className="bg-blue-100 text-gray-800">
              <th className="px-3 py-2 rounded-tl-xl">Curso</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Peso (%)</th>
              <th className="px-3 py-2">Mín.</th>
              <th className="px-3 py-2">Máx.</th>
              {(canUpdate || canDelete) && (
                <th className="px-3 py-2 rounded-tr-xl">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {evaluations?.content?.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  No hay evaluaciones encontradas.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-blue-400">Cargando...</td>
              </tr>
            )}
            {evaluations?.content?.map(eva => (
              <tr
                key={eva.id}
                className="hover:bg-blue-50 transition-all"
              >
                <td className="px-3 py-2">{eva.courseName}</td>
                <td className="px-3 py-2">{eva.name}</td>
                <td className="px-3 py-2">{eva.type}</td>
                <td className="px-3 py-2">{eva.date}</td>
                <td className="px-3 py-2">{eva.weight}</td>
                <td className="px-3 py-2">{eva.minScore}</td>
                <td className="px-3 py-2">{eva.maxScore}</td>
                {(canUpdate || canDelete) && (
                  <td className="px-3 py-2 flex gap-2">
                    {/* Modal Editar (trigger botón editar) */}
                    {canUpdate && (
                      <Modal
                        title="Editar Evaluación"
                        trigger={
                          <button
                            className="bg-green-100 hover:bg-green-200 rounded-full p-2 shadow"
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
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                        }
                        size="md"
                        actions={[
                          {
                            label: "Guardar",
                            onClick: (e, closeModal) => handleEditFormSubmit(e, closeModal, eva.id),
                            closeOnClick: false,
                            className: "bg-blue-600 text-white"
                          },
                          { label: "Cancelar", className: "bg-gray-300" }
                        ]}
                      >
                        {editingId === eva.id && renderForm(true)}
                      </Modal>
                    )}

                    {/* Modal Eliminar (trigger botón eliminar) */}
                    {canDelete && (
                      <Modal
                        title="¿Eliminar evaluación?"
                        trigger={
                          <button
                            className="bg-red-100 hover:bg-red-200 rounded-full p-2 shadow"
                            title="Eliminar"
                            onClick={() => setDeleteModalOpenId(eva.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        }
                        size="sm"
                        actions={[
                          {
                            label: "Sí, eliminar",
                            onClick: (e, closeModal) => handleDelete(eva.id, closeModal),
                            className: "bg-red-600 text-white"
                          },
                          { label: "Cancelar", className: "bg-gray-300" }
                        ]}
                      >
                        <div className="text-center py-4">
                          ¿Seguro que deseas eliminar esta evaluación? <br />
                          Esta acción no se puede deshacer.
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