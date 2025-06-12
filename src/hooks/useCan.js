import useAuth from './useAuth';

const useCan = (perm) => {
  const { user } = useAuth(); 
  return user?.permissions?.includes(perm);
};

export default useCan;
