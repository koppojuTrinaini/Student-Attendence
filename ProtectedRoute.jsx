import { Navigate } from 'react-router-dom';
import { getToken, getRole } from './auth';

const ProtectedRoute = ({ children, role }) => {
  const token = getToken();
  const currentRole = getRole();

  if (!token || (role && currentRole !== role)) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;
