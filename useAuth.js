import { useEffect, useState } from 'react';
import { getToken, getRole } from '../utils/auth';

export const useAuth = () => {
  const [auth, setAuth] = useState({ token: null, role: null });

  useEffect(() => {
    setAuth({ token: getToken(), role: getRole() });
  }, []);

  return auth;
};
