import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from './api';
import { setToken, setRole } from './auth';

const AuthPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const route = `/${type}/${isRegister ? 'register' : 'login'}`;
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password, username: form.username }
        : { email: form.email, password: form.password };
      const { data } = await api.post(route, payload);
      if (!isRegister) {
        setToken(data.token);
        setRole(data.role);
        toast.success('Signed in successfully');
        navigate(type === 'admin' ? '/admin/dashboard' : '/teacher/dashboard');
      } else {
        toast.success(`${type === 'admin' ? 'Admin' : 'Teacher'} registered successfully`);
        setIsRegister(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">{type === 'admin' ? 'Admin' : 'Teacher'} access</p>
            <h1 className="mt-3 text-3xl font-semibold">{isRegister ? 'Register account' : 'Login to continue'}</h1>
          </div>
          <div className="rounded-3xl bg-slate-800/80 px-4 py-2 text-slate-300 border border-white/10">{type === 'admin' ? 'Admin Portal' : 'Teacher Portal'}</div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegister && type !== 'teacher' && (
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Username</label>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 flex items-center gap-3">
                <UserPlus size={18} className="text-fuchsia-400" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Admin username"
                  className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>
          )}
          {isRegister && type === 'teacher' && (
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Name</label>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 flex items-center gap-3">
                <UserPlus size={18} className="text-fuchsia-400" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Teacher name"
                  className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Email</label>
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 flex items-center gap-3">
              <Mail size={18} className="text-fuchsia-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 flex items-center gap-3">
              <Lock size={18} className="text-fuchsia-400" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-3xl bg-fuchsia-600 px-6 py-4 text-white font-semibold shadow-xl shadow-fuchsia-500/20 hover:bg-fuchsia-700 transition disabled:opacity-70">
            {loading ? 'Working...' : isRegister ? 'Create account' : 'Continue'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <p>{isRegister ? 'Already have an account?' : 'Need a new account?'}</p>
          <button onClick={() => setIsRegister(!isRegister)} className="text-fuchsia-400 hover:text-fuchsia-200 transition">
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
