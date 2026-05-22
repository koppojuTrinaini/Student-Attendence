import { useEffect, useState } from 'react';
import { Users, School2, ClipboardList, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import api from './api';
import DashboardCard from './DashboardCard';

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, attendancePercentage: 0 });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data } = await api.get('/admin/dashboard');
      setSummary({
        totalStudents: data.totalStudents,
        totalTeachers: data.totalTeachers,
        totalClasses: data.totalClasses,
        attendancePercentage: Number(data.attendancePercentage.toFixed(1)),
      });
    };
    loadDashboard();
  }, []);

  const chartData = [
    { name: 'Mon', value: 70 },
    { name: 'Tue', value: 82 },
    { name: 'Wed', value: 91 },
    { name: 'Thu', value: 86 },
    { name: 'Fri', value: 94 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">Admin dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold">Attendance overview</h1>
              <p className="mt-3 text-slate-400 max-w-2xl">Track student participation, teacher assignments, and class summaries with glassmorphism style analytics.</p>
            </div>
            <button className="rounded-full bg-fuchsia-600 px-6 py-3 font-semibold text-white shadow-xl shadow-fuchsia-500/20 hover:bg-fuchsia-700 transition">Export report</button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard title="Total students" value={summary.totalStudents} icon={<Users size={24} />} trend="Live student count" />
          <DashboardCard title="Total teachers" value={summary.totalTeachers} icon={<School2 size={24} />} trend="Assigned instructors" />
          <DashboardCard title="Total classes" value={summary.totalClasses} icon={<ClipboardList size={24} />} trend="Class sections" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-lg shadow-slate-950/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-[0.3em]">Attendance rate</p>
                <h2 className="mt-2 text-3xl font-semibold">{summary.attendancePercentage}%</h2>
              </div>
              <div className="rounded-3xl bg-slate-900 px-4 py-3 text-slate-100">Live</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none' }} />
                <Area type="monotone" dataKey="value" stroke="#c084fc" fill="url(#attendanceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 backdrop-blur-xl shadow-lg shadow-slate-950/10">
            <div className="flex items-center gap-4 mb-6">
              <BarChart3 className="text-fuchsia-500" size={24} />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Latest attendance</h2>
              </div>
            </div>
            <div className="space-y-4">
              {['Marked attendance for grade 9A', 'Teacher assignment updated', 'Student registration completed'].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-slate-300">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
