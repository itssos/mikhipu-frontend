import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CourseTable from '../components/CourseTable';
import EvaluationManager from '../components/EvaluationManager';
import Tabs from '../components/UI/Tabs.jsx'; // Asegúrate de importar el Tabs que creaste
import ScoreManager from '../components/ScoreManager.jsx';

const CoursePage = () => {
  const { user, person, logout } = useAuth();
  const navigate = useNavigate();

  const tabData = [
    {
      label: "Cursos",
      content: <CourseTable />
    },
    {
      label: "Evaluaciones",
      content: <EvaluationManager />
    },
    {
      label: "Notas",
      content: <ScoreManager />
    }
  ];

  return (
    <div className="min-h-screen">
      <Tabs tabs={tabData} />
    </div>
  );
};

export default CoursePage;
