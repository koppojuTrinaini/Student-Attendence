import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, CheckCircle2, Sparkles, Phone } from 'lucide-react';
import SectionCard from './SectionCard';

const Home = () => (
  <div className="relative overflow-hidden">
    <section className="relative min-h-[85vh] bg-gradient-to-br from-fuchsia-500/20 via-violet-200/20 to-sky-500/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800 py-20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.2),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_20%)]" />
      <div className="relative max-w-7xl mx-auto px-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-sm font-semibold text-fuchsia-600 shadow-sm">
            Student Responsive Attendance Through Mobile
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-950 dark:text-white leading-tight">
            Elevate attendance management with powerful teacher and admin workflows.
          </h1>
          <p className="max-w-xl text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            Manage classes, track attendance, and access insightful analytics from a modern responsive dashboard built for mobile-first schools.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/admin/login" className="inline-flex items-center gap-3 rounded-full bg-fuchsia-600 px-6 py-3 text-white shadow-xl shadow-fuchsia-500/20 hover:bg-fuchsia-700 transition">
              Admin Login <ArrowRight size={18} />
            </a>
            <a href="/teacher/login" className="inline-flex items-center gap-3 rounded-full border border-white/50 bg-white/90 px-6 py-3 text-slate-950 dark:bg-slate-900 dark:text-white shadow-sm hover:bg-white transition">
              Teacher Login
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="rounded-[2rem] border border-white/30 bg-white/60 dark:bg-slate-950/70 backdrop-blur-xl p-8 shadow-2xl shadow-slate-900/10">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/40 bg-slate-50/80 dark:bg-slate-900/70 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Attendance summary</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Fast, accurate, mobile ready</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">Keep attendance records synced with analytics and verify attendance for every class day.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Mobile Ready UI', accent: 'from-fuchsia-500 to-pink-500', icon: <Sparkles size={20} /> },
                { label: 'Analytics Charts', accent: 'from-sky-500 to-cyan-500', icon: <BookOpen size={20} /> },
                { label: 'Teacher workflows', accent: 'from-violet-500 to-fuchsia-500', icon: <Users size={20} /> },
                { label: 'Attendance tracking', accent: 'from-emerald-500 to-lime-500', icon: <CheckCircle2 size={20} /> },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/20 bg-white/70 dark:bg-slate-900/80 p-5 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-slate-950 dark:text-white font-semibold">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mx-auto max-w-2xl mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-fuchsia-600">Features</p>
          <h2 className="mt-5 text-4xl font-semibold text-slate-950 dark:text-white">Built for modern attendance experiences</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Actionable dashboards, attendance workflow, teacher assignment and analytics with a premium glass interface.</p>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12 } }
        }} className="grid gap-6 md:grid-cols-3">
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <SectionCard title="Admin controls" description="Manage teachers, students, classes, and attendance reports from one dashboard." icon={<Users size={24} />} accent="from-fuchsia-500 to-pink-500" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <SectionCard title="Teacher workflow" description="Select class, mark attendance, and track history in a responsive attendance board." icon={<BookOpen size={24} />} accent="from-sky-500 to-cyan-500" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <SectionCard title="Analytics" description="Visualize student attendance percentage and activity with responsive charts." icon={<Sparkles size={24} />} accent="from-violet-500 to-fuchsia-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>

    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-6 grid gap-8 lg:grid-cols-2 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <div className="rounded-[2rem] border border-white/30 bg-white/60 dark:bg-slate-950/70 backdrop-blur-xl p-10 shadow-2xl shadow-slate-900/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-fuchsia-500/10 text-fuchsia-600 flex items-center justify-center">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-[0.24em]">Contact</p>
                <p className="text-lg font-semibold text-slate-950 dark:text-white">Start your free attendance rollout today.</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Reach out for onboarding, training, and deployment support for your school attendance system.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="grid gap-6 sm:grid-cols-2">
          {[
            { title: 'Secure JWT', value: 'Encrypted', accent: 'from-fuchsia-500 to-pink-500' },
            { title: 'Mobile first', value: 'Responsive', accent: 'from-sky-500 to-cyan-500' },
            { title: 'Attendance', value: 'Date-wise', accent: 'from-emerald-500 to-lime-500' },
            { title: 'Reports', value: 'Export ready', accent: 'from-violet-500 to-fuchsia-500' },
          ].map((item) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-3xl border border-white/30 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
              <p className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <footer id="contact" className="py-14 bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="uppercase text-xs tracking-[0.3em] text-fuchsia-500">Stay connected</p>
        <h3 className="mt-4 text-3xl font-semibold">Secure attendance management with a modern dashboard.</h3>
        <p className="mt-4 max-w-2xl mx-auto text-slate-400">A professional platform for administrators and teachers to track attendance, manage classes, and review performance from mobile or desktop.</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-5 py-3">Email: attendance@example.com</span>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-5 py-3">Phone: +123 456 7890</span>
        </div>
      </div>
    </footer>
  </div>
);

export default Home;
