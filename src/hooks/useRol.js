import useAuth from '../hooks/useAuth';

const useRol = (roles) => {
  const { user } = useAuth();
  if (Array.isArray(roles)) {
    return roles.includes(user?.role);
  }
  return user?.role === roles;
};

export default useRol;
