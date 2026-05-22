export const getToken = () => localStorage.getItem('attendance_token');
export const setToken = (token) => localStorage.setItem('attendance_token', token);
export const clearToken = () => localStorage.removeItem('attendance_token');
export const getRole = () => localStorage.getItem('attendance_role');
export const setRole = (role) => localStorage.setItem('attendance_role', role);
export const clearRole = () => localStorage.removeItem('attendance_role');
