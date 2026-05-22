import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import ProtectedRoute from './ProtectedRoute';
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:type/login" element={<AuthPage />} />
          <Route path="/:type/register" element={<AuthPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
