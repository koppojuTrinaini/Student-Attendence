const DashboardCard = ({ title, value, icon, trend }) => (
  <div className="rounded-3xl border border-white/20 bg-white/60 dark:bg-slate-900/75 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-300">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
        <p className="text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
      </div>
    </div>
    {trend && <p className="text-sm text-slate-500 dark:text-slate-400">{trend}</p>}
  </div>
);

export default DashboardCard;
