import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CourseTable from '../components/CourseTable';

const CoursePage = () => {
  const { user, person, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <CourseTable />
    </div>
  );
};

export default CoursePage;
