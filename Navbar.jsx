import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Admin Login', to: '/admin/login' },
  { label: 'Teacher Login', to: '/teacher/login' },
  { label: 'Features', to: '#features' },
  { label: 'Contact', to: '#contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleHash = (e, to) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + to);
      return;
    }
    const el = document.querySelector(to);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/80 shadow-sm border-b border-white/30 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Attendance Mobile
        </Link>

        <div className="hidden md:flex items-center gap-6 text-slate-700 dark:text-slate-200">
          {links.map((link) => (
            link.to.startsWith('#') ? (
              <a key={link.label} href={link.to} onClick={(e) => handleHash(e, link.to)} className="hover:text-fuchsia-500 transition">
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.to} className="hover:text-fuchsia-500 transition">
                {link.label}
              </Link>
            )
          ))}
          <button onClick={toggleTheme} className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button className="md:hidden p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              link.to.startsWith('#') ? (
                <a key={link.label} href={link.to} onClick={(e) => handleHash(e, link.to)} className="text-slate-900 dark:text-slate-100 hover:text-fuchsia-500 transition">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className="text-slate-900 dark:text-slate-100 hover:text-fuchsia-500 transition">
                  {link.label}
                </Link>
              )
            ))}
            <button onClick={toggleTheme} className="w-full py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition flex items-center justify-center gap-2">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Theme
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
